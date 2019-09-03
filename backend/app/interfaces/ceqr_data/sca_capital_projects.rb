module CeqrData
  class ScaCapitalProjects < Base  
    self.schema = "sca_capital_projects"

    # all SCA Capital Project schools that intersect a district & subdistrict
    def sca_projects_intersecting_subdistrict_geom(subdistrict_geom)
      @dataset.select(
        :geom,
        :project_dsf,
        :name,
        :org_level,
        :capacity,
        :pct_ps,
        :pct_is,
        :pct_hs,
        :guessed_pct,
        :start_date,
        :planned_end_date,
        :total_est_cost,
        :funding_current_budget,
        :funding_previous,
        :pct_funded
      ).where{st_intersects(st_geomfromtext("#{subdistrict_geom}", "#{subdistrict_geom.srid}"), :geom)}
    end
  end
end
