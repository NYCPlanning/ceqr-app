module CeqrData
  class NycAcs < Base
    self.schema = "nyc_acs"

  # THERE'S NO GEOMETRY FOR NYC ACS TABLE??
    # def self.st_union_geoids_centroid(geoids)
    #   select('ST_CENTROID(ST_MULTI(ST_UNION(geom)))').where(geoid: geoids).first.st_centroid
    # end

    # def self.for_geom(geom)
    #   select('DISTINCT geoid').where("ST_Intersects(ST_GeomFromText('#{geom.as_text}', #{geom.srid}), geom)").map &:geoid
    # end
  end
end
