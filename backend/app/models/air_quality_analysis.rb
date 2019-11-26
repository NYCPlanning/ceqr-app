class AirQualityAnalysis < ApplicationRecord
  belongs_to :project
  before_create :set_air_quality_data
  
  def buffer_1000
    project.bbls_geom.buffer(1000)
  end

  def buffer_500
    project.bbls_geom.buffer(500)
  end

  def set_air_quality_data
    db = CeqrData::DcpAreasOfConcern.version('latest')
    self.in_area_of_concern = db.intersects?(project.bbls_geom)
  end
end
