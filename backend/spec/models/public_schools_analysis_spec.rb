require 'rails_helper'

RSpec.describe PublicSchoolsAnalysis, type: :model do
  before do
    @schoolSubdistrictMock = class_double('SchoolSubdistrict')
    allow(@schoolSubdistrictMock).to receive(:intersecting_with).and_return([
      {
        district: 1,
        subdistrict: 2
      }
    ])

    stub_const("#{Db}::SchoolSubdistrict", @schoolSubdistrictMock)
  end

  let(:project) { create(:project) }
  let(:analysis) { create(:public_schools_analysis, project: project) }

  describe "should set subdistricts on save and update" do
    it "sets subdistricts correctly" do
      expect(analysis.subdistricts_from_db[0]['district']).to eq(1)
    end
  end

  describe "should set bluebook on save and update" do
    it "sets bluebook correctly" do
      expect(analysis.bluebook[0]['district']).to eq(1)
      expect(analysis.bluebook[0]['subdistrict']).to eq(2)
      # expect(analysis.bluebook[0]['name']).to eq('')
    end
  end
end
