module CeqrData
  class DoeSchoolSubdistricts < Base  
    self.schema = "doe_school_subdistricts"

    # all subdistricts that intersect with a project's bbl's geometry
    def intersecting_with_bbls(bbls_geom)
       @dataset.distinct.select(:geom, :district, :subdistrict).where{st_intersects(st_geomfromtext("#{bbls_geom}", "#{bbls_geom.srid}"), :geom)}
    end

    # all subdistricts that match a "pair" of district & subdistrict values, less expensive then re-querying for intersecting geometry (intersecting_with_bbls)
    # used in public schools analysis model to query for geometry of specific subdistricts
    # also used in public schools analysis model to check whether a school is in a "school choice zone"
    # intersecting_with_bbls query must be run for a project before we run this query
    def for_subdistrict_pairs(subdistrict_pairs)
       @dataset.select(
          :geom, :district, :subdistrict, :school_choice_ps, :school_choice_is
      ).where(Sequel.lit("(district, subdistrict) IN (VALUES #{subdistrict_pairs.join(',')})")).all
    end
  end
end
