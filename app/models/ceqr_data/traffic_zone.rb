class CeqrData::TrafficZone < CeqrDataBase
  include ::ReadOnlyModel

  def self.for_geom(geom)
    select('DISTINCT zone').where("ST_Intersects(ST_GeomFromText('#{geom.as_text}', #{geom.srid}), geom)").map &:zone
  end
end