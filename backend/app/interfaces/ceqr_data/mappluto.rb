module CeqrData
  class Mappluto < Base  
    self.schema = "mappluto"

    def st_union_bbls(bbls)
      parse_wkb(
        @dataset.select{ ST_MULTI(ST_UNION(geom)) }.where(bbl: bbls).first[:st_multi]
      )
    end
  end
end
