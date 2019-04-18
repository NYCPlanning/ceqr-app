class Db::TrafficZone < DataRecord
  self.table_name = "traffic_zones.2014"
  
  def self.for_geom(geom)
    select('DISTINCT zone').where("ST_Intersects(ST_GeomFromText('#{geom.as_text}', #{geom.srid}), geom)").map &:zone
  end
end
