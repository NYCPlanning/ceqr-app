class TransportationAnalysis < ApplicationRecord
  # Set initial data on analysis
  before_create :set_initial_analysis_data
  after_create :set_transportation_planning_factors
  
  # Trigger when census tract selection changes
  before_update :compute_for_new_census_tracts,
    if: Proc.new { census_tracts_selection_changed? }


  belongs_to :project
  has_many :transportation_planning_factors, class_name: 'TransportationPlanningFactors', dependent: :destroy

  def selected_census_tract_geoids
    required_census_tracts_selection + census_tracts_selection
  end

  def compute_for_updated_bbls!
    set_initial_analysis_data
    save!
  end

  def compute_for_changed_land_use!
    set_transportation_planning_factors
    save!
  end

  def compute_for_new_census_tracts
    set_census_tracts_centroid

    transportation_planning_factors.each &:refresh_census_tracts!
  end

  # Call methods to compute data that needs to be refreshed when model's owning project
  # is updated (or at analysis creation)
  def set_initial_analysis_data
    set_traffic_zone
    set_required_census_tracts_selection
    set_census_tracts_selection
    set_census_tracts_centroid
  end

  private
    # TODO: will eventually need to swap out if ACS/CTPP data in a
    # TransportationPlanningFactors model is changed.
    def nyc_census_tracts_version
      2010
    end
  
    def set_transportation_planning_factors            
      project.land_uses.each do |land_use|
        # Currently, only create TransportationPlanningFactors for residential and office land uses
        next unless ["residential", "office"].include? land_use
        
        factors = transportation_planning_factors.find_by(land_use: land_use)

        if factors.nil?
          TransportationPlanningFactors.create!(
            land_use: land_use,
            transportation_analysis_id: self.id
          )
        end
      end

      # delete any planning factors no longer needed
      transportation_planning_factors.each do |factors|
        factors.destroy if !project.land_uses.include?(factors.land_use)
      end
    end
  
    # Find and set the intersecting Census Tracts
    def set_required_census_tracts_selection
      tracts = CeqrData::NycCensusTracts.version(
        nyc_census_tracts_version
      ).for_geom(project.bbls_geom)
      self.required_census_tracts_selection = tracts || []
    end

    # Find and set the adjacent Census Tracts as initial study selection
    def set_census_tracts_selection
      tracts = CeqrData::NycCensusTracts.version(
        nyc_census_tracts_version
      ).touches_geoids(self.required_census_tracts_selection)

      self.census_tracts_selection = tracts || []
    end

    # Find and set the centroid
    def set_census_tracts_centroid
      geoids = self.required_census_tracts_selection + self.census_tracts_selection
      # Why are we getting back empty arrays? Does this indicate something else is wrong?
      if geoids != []
        centroid = CeqrData::NycCensusTracts.version(
          nyc_census_tracts_version
        ).st_union_geoids_centroid(geoids)
        self.census_tracts_centroid = centroid
      end
    end


    # Find, set, and save the traffic zone
    def set_traffic_zone
      zones = CeqrData::TrafficZones.version('2014').for_geom(project.bbls_geom)

      # Currently set traffic zone to most conservative touched by study area
      self.traffic_zone = zones.max
    end
end
