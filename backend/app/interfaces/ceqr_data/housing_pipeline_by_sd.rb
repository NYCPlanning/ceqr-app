module CeqrData
  class HousingPipelineBySd < Base  
    self.schema = "sca_housing_pipeline_by_sd"

    # primary & intermediate school students added by new housing in subdistrict
    def ps_is_students_from_new_housing_by_subdistrict(subdistrict_pairs)
    	@dataset.select(
    		:district, :subdistrict, Sequel[:new_students].as(:students), Sequel[:org_level].as(:level)
    	).where(Sequel.lit("(CAST(district AS int), CAST(subdistrict AS int)) IN (VALUES #{subdistrict_pairs.join(',')})")).all
    end
  end
end
