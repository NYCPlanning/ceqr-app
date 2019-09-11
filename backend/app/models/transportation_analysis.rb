class TransportationAnalysis < ApplicationRecord
  before_save :compute_for_model_update
  before_create :compute_for_project_create_or_update

  belongs_to :project
  belongs_to :nyc_acs_data_package, class_name: "DataPackage"
  belongs_to :ctpp_data_package, class_name: "DataPackage"

  # This is a workaround for a lot of fancy inititalization that the activerecord-postgis-adapter does
  # for the attribute types it defines. 'ActiveRecord::ConnectionAdapters::PostGIS::OID::Spatial' is extended
  # in model/attributes/lng_lat.rb
  attribute :jtw_study_area_centroid, Attributes::LngLat.new('', 'geometry(Point,4326)')

  def compute_for_updated_bbls!
    compute_for_project_create_or_update
    save!
  end

  def selected_census_tract_geoids
    required_jtw_study_selection + jtw_study_selection
  end

  private
    # # Find and set the intersecting Census Tracts
    def compute_required_study_selection
      tracts = CeqrData::NycCensusTracts.version(
        nyc_acs_data_package.table_for('nyc_census_tract_boundaries')
      ).for_geom(project.bbls_geom)
      self.required_jtw_study_selection = tracts || []
    end

    # Find and set the centroid
    def compute_study_area_centroid
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
    def compute_initial_study_selection
      tracts = CeqrData::NycCensusTracts.version(
        nyc_acs_data_package.table_for('nyc_census_tract_boundaries')
      ).touches_geoids(self.required_jtw_study_selection)

      self.jtw_study_selection = tracts || []
    end

    # Find, set, and save the traffic zone
    def compute_traffic_zone
      zones = CeqrData::TrafficZones.version('2014').for_geom(project.bbls_geom)

      # Currently set traffic zone to most conservative touched by study area
      self.traffic_zone = zones.max
    end

    # Query and build json blob of ACS modal splits
    def compute_acs_modal_splits
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
    def compute_ctpp_modal_splits
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

    # Call methods to compute data that needs to be refreshed when the model is updated
    def compute_for_model_update
      compute_study_area_centroid
    end

    # Call methods to compute data that needs to be refreshed when model's owning project
    # is updated (or at analysis creation)
    def compute_for_project_create_or_update
      compute_traffic_zone
      compute_required_study_selection
      compute_initial_study_selection
      compute_study_area_centroid
      compute_acs_modal_splits
      compute_ctpp_modal_splits
    end
end
