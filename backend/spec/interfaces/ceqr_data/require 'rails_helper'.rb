require 'rails_helper'

RSpec.describe "CeqrData SCA Enrollment Projections", type: :model do
  context "by school districts" do
    let(:sca_enrollment_projections_by_sd) { CeqrData::ScaEnrollmentProjectionsBySd.version('2018') }

    it "returns an array of future_enrollment_projections" do
      district = '2'
      buildYearMaxed = 2023

      future_enrollment_projections = sca_enrollment_projections_by_sd.enrollment_projection_by_subdistrict_for_year(buildYearMaxed, district)

      expect(future_enrollment_projections[0][:district]).to eq(district)
      expect(future_enrollment_projections[0][:school_year]).to eq('2023-24')
    end
  end

  context "by boroughs" do
    let(:sca_enrollment_projections_by_boro) { CeqrData::ScaEnrollmentProjectionsByBoro.version('2018') }

    it "returns an array of hs_projections" do
      project_borough = 'manhattan'
      buildYearMaxed = 2023

      hs_projections = sca_enrollment_projections_by_boro.enrollment_projection_by_boro_for_year(buildYearMaxed, project_borough)

      expect(hs_projections[0][:borough]).to eq(project_borough)
      # although we change this year to an integer for the public schools model, it come froms the database as a string
      expect(hs_projections[0][:year]).to eq('2023')
    end
  end
end