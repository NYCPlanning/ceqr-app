class TransportationAnalysis < ApplicationRecord
  # Set initial data on analysis
  before_create :set_initial_analysis_data

  # Trigger when a data pacakge changes
  before_update :compute_for_new_data_package, 
    if: Proc.new { nyc_acs_data_package_id_changed? || ctpp_data_package_id_changed? }
  
  # Trigger when census tract selection changes
  before_update :compute_for_new_census_tracts,
    if: Proc.new { jtw_study_selection_changed? }


  belongs_to :project
  belongs_to :nyc_acs_data_package, class_name: "DataPackage"
  belongs_to :ctpp_data_package, class_name: "DataPackage"


  def selected_census_tract_geoids
    required_jtw_study_selection + jtw_study_selection
  end

  def compute_for_updated_bbls!
    set_initial_analysis_data
    save!
  end

  def compute_for_new_data_package
    set_required_study_selection
    set_initial_study_selection
    set_study_area_centroid
    set_acs_modal_splits
    set_ctpp_modal_splits
  end

  def compute_for_new_census_tracts
    set_study_area_centroid
    set_acs_modal_splits
    set_ctpp_modal_splits
  end

  # Call methods to compute data that needs to be refreshed when model's owning project
  # is updated (or at analysis creation)
  def set_initial_analysis_data
    set_traffic_zone
    set_required_study_selection
    set_initial_study_selection
    set_study_area_centroid
    set_acs_modal_splits
    set_ctpp_modal_splits
  end

  private
    # # Find and set the intersecting Census Tracts
    def set_required_study_selection
      tracts = CeqrData::NycCensusTracts.version(
        nyc_acs_data_package.table_for('nyc_census_tract_boundaries')
      ).for_geom(project.bbls_geom)
      self.required_jtw_study_selection = tracts || []
    end

    # Find and set the centroid
    def set_study_area_centroid
      geoids = self.required_jtw_study_selection + self.jtw_study_selection
      # Why are we getting back empty arrays? Does this indicate something else is wrong?
      if geoids != []
        centroid = CeqrData::NycCensusTracts.version(
          nyc_acs_data_package.table_for('nyc_census_tract_boundaries')
        ).st_union_geoids_centroid(geoids)
        self.jtw_study_area_centroid = centroid
      end
    end

    # Find and set the adjacent Census Tracts as initial study selection
    def set_initial_study_selection
      tracts = CeqrData::NycCensusTracts.version(
        nyc_acs_data_package.table_for('nyc_census_tract_boundaries')
      ).touches_geoids(self.required_jtw_study_selection)

      self.jtw_study_selection = tracts || []
    end

    # Find, set, and save the traffic zone
    def set_traffic_zone
      zones = CeqrData::TrafficZones.version('2014').for_geom(project.bbls_geom)

      # Currently set traffic zone to most conservative touched by study area
      self.traffic_zone = zones.max
    end

    # Query and build json blob of ACS modal splits
    def set_acs_modal_splits
      tract_data = CeqrData::NycAcs.version(
        nyc_acs_data_package.table_for('nyc_acs')
      ).query.where(geoid: selected_census_tract_geoids).all

      self.acs_modal_splits = selected_census_tract_geoids.map do |geoid|
        tract = {}

        variables = tract_data.filter {|t| t[:geoid] == geoid}
        variables.each do |v|
          tract[v[:variable]] = v
        end

        tract
      end
    end

    # Query and build json blob of ACS modal splits
    def set_ctpp_modal_splits
      tract_data = CeqrData::CtppCensustractVariables.version(
        ctpp_data_package.table_for('ctpp_censustract_variables')
      ).query.where(geoid: selected_census_tract_geoids).all

      self.ctpp_modal_splits = selected_census_tract_geoids.map do |geoid|
        tract = {}

        variables = tract_data.filter {|t| t[:geoid] == geoid}
        variables.each do |v|
          tract[v[:variable]] = v
        end

        tract
      end
    end
end
