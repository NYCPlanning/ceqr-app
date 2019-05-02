class TransportationAnalysis < ApplicationRecord
  before_create :compute_study_selection!, :compute_study_area!
  after_create :load_data!

  before_save :compute_study_area!

  belongs_to :project

  def compute_study_selection!
    tracts = Db::CensusTract.for_geom(project.bbls_geom)

    self.jtw_study_selection = tracts
  end

  def compute_study_area!
    union = Db::CensusTract.st_union_geoids(self.jtw_study_selection)
    # get the centroid of union

    self.jtw_study_area = union.centroid
  end

  def load_data!  
    zones = Db::TrafficZone.for_geom(project.bbls_geom)

    # Currently set traffic zone to most conservative touched by study area
    self.traffic_zone = zones.max

    save!
  end
end
