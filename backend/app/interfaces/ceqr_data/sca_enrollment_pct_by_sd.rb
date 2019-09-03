module CeqrData
  class ScaEnrollmentPctBySd < Base
    self.schema = "sca_enrollment_pct_by_sd"
    
    # future enrollment multipliers by district and subdistrict
    def enrollment_percent_by_subdistrict(subdistrict_pairs)
      query.where(Sequel.lit("(district, subdistrict) IN (VALUES #{subdistrict_pairs.join(',')})")).all
    end
  end
end

