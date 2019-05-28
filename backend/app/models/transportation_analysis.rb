class TransportationAnalysis < ApplicationRecord
  before_save :compute_study_data

  after_create :compute_traffic_zone!

  belongs_to :project

  # loads all necessary data by calling ! methods which imply a save
  def load_data!
    compute_traffic_zone!
  end

  private
    # Find and set the intersecting Census Tracts
    def compute_study_selection
      tracts = Db::CensusTract.for_geom(project.bbls_geom)

      self.jtw_study_selection = tracts
    end

    # Find and set the centroid
    def compute_study_area
      centroid = Db::CensusTract.st_union_geoids_centroid(self.jtw_study_selection)

      self.jtw_study_area_centroid = centroid
    end

    # Call necessary methods for computing study selection & area
    def compute_study_data
      compute_study_selection
      compute_study_area
    end

    # Find, set, and save the traffic zone
    def compute_traffic_zone!
      zones = Db::TrafficZone.for_geom(project.bbls_geom)

      # Currently set traffic zone to most conservative touched by study area
      self.traffic_zone = zones.max

      save!
    end
end
