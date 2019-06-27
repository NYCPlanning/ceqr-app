class Db::CensusTract < DataRecord
  self.table_name = "nyc_census_tracts.2010"

  def self.st_union_geoids_centroid(geoids)
    select('ST_CENTROID(ST_MULTI(ST_UNION(geom)))').where(geoid: geoids).first.st_centroid
  end

  def self.for_geom(geom)
    select('DISTINCT geoid').where("ST_Intersects(ST_GeomFromText('#{geom.as_text}', #{geom.srid}), geom)").map &:geoid
  end

  def self.touches_geoids(geoids)
    selectionGeom = select("ST_MULTI(ST_UNION(geom))").where(geoid: geoids).first.st_multi
    select("geoid").where("ST_TOUCHES(ST_GeomFromText('#{selectionGeom.as_text}', #{selectionGeom.srid}), geom)").map &:geoid
  end
end
