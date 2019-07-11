module CeqrData
  class HousingPipelineByBoro < Base  
    self.schema = "sca_housing_pipeline_by_boro"

    # high school students added by new housing in borough
    def high_school_students_from_new_housing_by_boro(project_borough)
       @dataset.select(:borough, Sequel[:new_students].as(:hs_students)).where(borough: project_borough)
    end
  end
end
