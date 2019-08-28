module CeqrData
  class ScaEnrollmentProjectionsBySd < Base
    self.schema = "sca_enrollment_projections_by_sd"

  # primary and intermediate school student enrollment projections by year and borough
    def enrollment_projection_by_subdistrict_for_year(buildYearMaxed, district)
      @dataset.select(
      	:ps, :is, :district, :school_year
      ).where(district: district).where(Sequel.ilike(:school_year, "%#{buildYearMaxed}%"))
    end
  end
end
