module CeqrData
  class ScaCapacityProjects < Base  
    self.schema = "sca_capacity_projects"

    # all SCA Capacity Project schools that intersect a district & subdistrict
    def sca_projects_intersecting_subdistrict_geom(subdistrict_geom)
      @dataset.select(
        :geom,
        :uid,
        :name,
        :org_level,
        :capacity,
        :pct_ps,
        :pct_is,
        :pct_hs,
        :guessed_pct,
        :start_date,
        :total_est_cost,
        :funding_current_budget,
        :funding_previous,
        :pct_funded
      ).where{st_intersects(st_geomfromtext("#{subdistrict_geom}", "#{subdistrict_geom.srid}"), :geom)}
    end
  end
end
