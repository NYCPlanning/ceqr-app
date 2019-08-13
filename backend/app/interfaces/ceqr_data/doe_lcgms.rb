module CeqrData
  class DoeLcgms < Base  
    self.schema = "doe_lcgms"

    # all lcgms schools that intersect a district & subdistrict
    def lcgms_intersecting_subdistrict_geom(subdistricts_geom)
    	geom_parsed = parse_wkb(subdistricts_geom)
    	@dataset.select(
    		:geom, :name, :address, :bldg_id, :grades, :org_id, :org_level, :ps_enroll, :is_enroll, :hs_enroll
    	).where{st_intersects(st_geomfromtext("#{geom_parsed}", "#{geom_parsed.srid}"), :geom)}
    end
  end
end

