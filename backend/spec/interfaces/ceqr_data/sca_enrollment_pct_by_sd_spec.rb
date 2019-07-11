require 'rails_helper'

RSpec.describe CeqrData::ScaEnrollmentPctBySd, type: :model do
  let(:sca_enrollment_pct_by_sd_2018) { CeqrData::ScaEnrollmentPctBySd.version('2018') }
  let(:sca_enrollment_pct_by_sd_2017) { CeqrData::ScaEnrollmentPctBySd.version('2017') }
  
  describe "attributes schemas for 2017" do
    it "version 2017" do
      subdistricts = ["(2,1)"]

      future_enrollment_multipliers = sca_enrollment_pct_by_sd_2017.enrollment_percent_by_subdistrict(subdistricts)

      expect(future_enrollment_multipliers[0][:district]).to be_an Integer
      expect(future_enrollment_multipliers[0][:subdistrict]).to be_an Integer
      expect(future_enrollment_multipliers[0][:level]).to be_a String
      expect(future_enrollment_multipliers[0][:multiplier]).to be_a Float
    end
  end

  describe "#enrollment_percent_by_subdistrict for 2018" do
    it "returns an array of future_enrollment_multipliers" do
      subdistricts = ["(2,1)"]

      future_enrollment_multipliers = sca_enrollment_pct_by_sd_2018.enrollment_percent_by_subdistrict(subdistricts)

      expect(future_enrollment_multipliers[0][:district]).to be_an Integer
      expect(future_enrollment_multipliers[0][:subdistrict]).to be_an Integer
      expect(future_enrollment_multipliers[0][:level]).to be_a String
      expect(future_enrollment_multipliers[0][:multiplier]).to be_a Float

      expect(future_enrollment_multipliers[0][:district]).to eq(2)
      expect(future_enrollment_multipliers[0][:subdistrict]).to eq(1)
    end
  end
end
