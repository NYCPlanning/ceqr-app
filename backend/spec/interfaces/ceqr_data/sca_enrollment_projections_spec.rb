require 'rails_helper'

RSpec.describe "CeqrData SCA Enrollment Projections", type: :model do
  ##### FUTURE ENROLLMENT PROJECTIONS
  context "by school districts" do
    let(:sca_enrollment_projections_by_sd_2018) { CeqrData::ScaEnrollmentProjectionsBySd.version('2018') }
    let(:sca_enrollment_projections_by_sd_2017) { CeqrData::ScaEnrollmentProjectionsBySd.version('2017') }
  
    # future_enrollment_projections VERSION 2018
    it "returns an array of future_enrollment_projections VERSION 2018" do
      district = '2'
      buildYearMaxed = '2023'

      future_enrollment_projections = sca_enrollment_projections_by_sd_2018.enrollment_projection_by_subdistrict_for_year(buildYearMaxed, district)

      expect(future_enrollment_projections.first[:district]).to be_a String
      expect(future_enrollment_projections.first[:ps]).to be_an Integer
      expect(future_enrollment_projections.first[:is]).to be_an Integer
      expect(future_enrollment_projections.first[:school_year]).to be_a String

      expect(future_enrollment_projections.first[:district]).to eq(district)
      expect(future_enrollment_projections.first[:school_year]).to eq('2023-24')
    end

    # future_enrollment_projections VERSION 2017
    it "returns an array of future_enrollment_projections VERSION 2017" do
      district = '2'
      buildYearMaxed = '2023'

      future_enrollment_projections = sca_enrollment_projections_by_sd_2017.enrollment_projection_by_subdistrict_for_year(buildYearMaxed, district)

      expect(future_enrollment_projections.first[:district]).to be_a String
      expect(future_enrollment_projections.first[:ps]).to be_an Integer
      expect(future_enrollment_projections.first[:is]).to be_an Integer
      expect(future_enrollment_projections.first[:school_year]).to be_a String

      expect(future_enrollment_projections.first[:district]).to eq(district)
      expect(future_enrollment_projections.first[:school_year]).to eq('2023-24')
    end
  end

  ### HS PROJECTIONS
  context "by boroughs" do
    let(:sca_enrollment_projections_by_boro_2018) { CeqrData::ScaEnrollmentProjectionsByBoro.version('2018') }
    let(:sca_enrollment_projections_by_boro_2017) { CeqrData::ScaEnrollmentProjectionsByBoro.version('2017') }

    # hs_projections VERSION 2018
    it "returns an array of hs_projections VERSION 2018" do
      project_borough = 'manhattan'
      buildYearMaxed = '2023'

      hs_projections = sca_enrollment_projections_by_boro_2018.enrollment_projection_by_boro_for_year(buildYearMaxed, project_borough)

      expect(hs_projections.first[:year]).to be_a String
      expect(hs_projections.first[:hs]).to be_an Integer
      expect(hs_projections.first[:year]).to be_a String

      expect(hs_projections.first[:borough]).to eq(project_borough)
      # although we change this year to an integer for the public schools model, it come froms the database as a string
      expect(hs_projections.first[:year]).to eq('2023')
    end

    # hs_projections VERSION 2017
    it "returns an array of hs_projections VERSION 2017" do
      project_borough = 'manhattan'
      buildYearMaxed = '2023'

      hs_projections = sca_enrollment_projections_by_boro_2017.enrollment_projection_by_boro_for_year(buildYearMaxed, project_borough)

      expect(hs_projections.first[:year]).to be_a String
      expect(hs_projections.first[:hs]).to be_an Integer
      expect(hs_projections.first[:year]).to be_a String

      expect(hs_projections.first[:borough]).to eq(project_borough)
      # although we change this year to an integer for the public schools model, it come froms the database as a string
      expect(hs_projections.first[:year]).to eq('2023')
    end
  end

end
