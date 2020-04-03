module CeqrData
  class ScaEProjectionsByBoro < Base
    self.schema = "sca_e_projections_by_boro"
  
  	# high school student enrollment projections by year and borough
    def enrollment_projection_by_boro_for_year(buildYearMaxed, project_borough)
      @dataset.select(
        :borough, :year, :hs
      ).where(year: buildYearMaxed).where(borough: project_borough)
    end
  end
end
