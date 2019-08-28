module CeqrData
  class DoeLcgms < Base  
    self.schema = "doe_lcgms"

    # all lcgms schools that intersect a district & subdistrict
    def lcgms_intersecting_subdistrict_geom(subdistrict_geom)
      @dataset.select(
        :geom, :name, :address, :bldg_id, :grades, :org_id, :org_level, :ps_enroll, :is_enroll, :hs_enroll
      ).where{st_intersects(st_geomfromtext("#{subdistrict_geom}", "#{subdistrict_geom.srid}"), :geom)}
    end
  end
end
