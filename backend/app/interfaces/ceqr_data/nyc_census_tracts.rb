module CeqrData
  class NycCensusTracts < Base
    self.schema = "nyc_census_tracts"

    def st_union_geoids_centroid(geoids)
      parse_wkb(
        query.select { ST_CENTROID(ST_MULTI(ST_UNION(geom))) }.where(geoid: geoids).first[:st_centroid]
      )
    end
  
    def for_geom(geometry)
      results = query.select{ DISTINCT geoid }.where{ ST_Intersects(ST_GeomFromText("#{geometry.as_text}", "#{geometry.srid}"), geom) }
      results.map { |g| g[:geoid] }
    end
  
    def touches_geoids(geoids)
      selectWKB = query.select{ ST_MULTI(ST_UNION(geom)) }.where(geoid: geoids).first[:st_multi]
      results = query.select(:geoid).where{ ST_Touches(ST_GeomFromEWKB(Sequel.cast(selectWKB, "geometry")), geom) }
      results.map { |g| g[:geoid] }
    end
  end
end



