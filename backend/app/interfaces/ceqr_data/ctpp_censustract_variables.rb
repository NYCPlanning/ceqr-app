module CeqrData
  class CtppCensustractVariables < Base
    self.schema = "ctpp_censustract_variables"
  
    # def st_union_geoids_centroid(geoids)
    #   result = query.select{ ST_CENTROID(ST_MULTI(ST_UNION(geom))) }.where(geoid: geoids).first[:st_centroid]
    #   parse_wkb(result)
    # end
  
    # def for_geom(geom)
    #   results = query.select{ DISTINCT geoid }.where{ ST_Intersects(ST_GeomFromText("#{geometry.as_text}", "#{geometry.srid}"), geom) }
    #   results.map { |g| g[:geoid] }
    # end
  end
end
