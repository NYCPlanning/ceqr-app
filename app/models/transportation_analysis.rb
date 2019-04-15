class TransportationAnalysis < ApplicationRecord
  after_create :load_data!
  
  belongs_to :project

  def load_data!  
    zones = Db::TrafficZone.for_geom(project.bbls_geom)

    # self.multiple_zones = zones.count > 1
    self.traffic_zone = zones.max # Currently set traffic zone to most conservative touched by study area

    save!
  end
end
