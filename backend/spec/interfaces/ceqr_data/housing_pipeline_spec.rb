require 'rails_helper'

RSpec.describe "CeqrData SCA HousingPipeline", type: :model do
  context "by school districts" do
    let(:sca_housing_pipeline_by_sd_2018) { CeqrData::HousingPipelineBySd.version('2018') }
    let(:sca_housing_pipeline_by_sd_2017) { CeqrData::HousingPipelineBySd.version('2017') }

    it "returns future_enrollment_new_housing value 2018" do
      subdistricts = ["(2,1)"]

      future_enrollment_new_housing = sca_housing_pipeline_by_sd_2018.ps_is_students_from_new_housing_by_subdistrict(subdistricts)

      expect(future_enrollment_new_housing[0][:district]).to be_a String
      expect(future_enrollment_new_housing[0][:subdistrict]).to be_an String
      expect(future_enrollment_new_housing[0][:students]).to be_an Integer
      expect(future_enrollment_new_housing[0][:level]).to be_a String

      expect(future_enrollment_new_housing[0][:district]).to eq('2')
      expect(future_enrollment_new_housing[0][:subdistrict]).to eq('1')
    end

    it "returns future_enrollment_new_housing value 2017" do
      subdistricts = ["(2,1)"]

      future_enrollment_new_housing = sca_housing_pipeline_by_sd_2017.ps_is_students_from_new_housing_by_subdistrict(subdistricts)

      expect(future_enrollment_new_housing[0][:district]).to be_a String
      expect(future_enrollment_new_housing[0][:subdistrict]).to be_an String
      expect(future_enrollment_new_housing[0][:students]).to be_an Integer
      expect(future_enrollment_new_housing[0][:level]).to be_a String

      expect(future_enrollment_new_housing[0][:district]).to eq('2')
      expect(future_enrollment_new_housing[0][:subdistrict]).to eq('1')
    end
  end

  context "by boroughs" do
    let(:sca_housing_pipeline_by_boro_2018) { CeqrData::HousingPipelineByBoro.version('2018') }
    let(:sca_housing_pipeline_by_boro_2017) { CeqrData::HousingPipelineByBoro.version('2017') }

    it "returns hs_students_from_housing value" do
      project_borough = "Manhattan"

      hs_students_from_housing = sca_housing_pipeline_by_boro_2018.high_school_students_from_new_housing_by_boro(project_borough)

      expect(hs_students_from_housing.first[:borough]).to be_a String
      expect(hs_students_from_housing.first[:hs_students]).to be_an Integer
      expect(hs_students_from_housing.first[:borough]).to be_a String

      expect(hs_students_from_housing.first[:borough]).to eq(project_borough)
    end

  it "returns hs_students_from_housing value" do
      project_borough = "Manhattan"

      hs_students_from_housing = sca_housing_pipeline_by_boro_2017.high_school_students_from_new_housing_by_boro(project_borough)

      expect(hs_students_from_housing.first[:borough]).to be_a String
      expect(hs_students_from_housing.first[:hs_students]).to be_an Integer
      expect(hs_students_from_housing.first[:borough]).to be_a String

      expect(hs_students_from_housing.first[:borough]).to eq(project_borough)
    end
  end

end
