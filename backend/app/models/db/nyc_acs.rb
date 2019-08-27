class Db::NycAcs < DataRecord
  self.table_name = "nyc_acs.2017"

  def self.st_union_geoids_centroid(geoids)
    select('ST_CENTROID(ST_MULTI(ST_UNION(geom)))').where(geoid: geoids).first.st_centroid
  end

  def self.for_geom(geom)
    select('DISTINCT geoid').where("ST_Intersects(ST_GeomFromText('#{geom.as_text}', #{geom.srid}), geom)").map &:geoid
  end
end