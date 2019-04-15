class Db::TrafficZone < DataRecord
  self.dataset = "traffic_zones"
  self.version = "2014"
  
  def self.for_geom(geom)
    select('DISTINCT zone').where("ST_Intersects(ST_GeomFromText('#{geom.as_text}', #{geom.srid}), geom)").map &:zone
  end
end