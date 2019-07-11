require 'rails_helper'

RSpec.describe TransportationAnalysis, type: :model do    
  before do
    @trafficZoneMock = class_double('TrafficZone')
    @trafficZoneObject = double()

    allow(@trafficZoneMock).to receive(:version).and_return(@trafficZoneObject)

    allow(@trafficZoneObject).to receive(:for_geom).and_return([2])

    @censusTractMock = class_double('CensusTract')
    @censusTractObject = double()

    allow(@censusTractMock).to receive(:version).and_return(@censusTractObject)

    allow(@censusTractObject).to receive(:for_geom).and_return(['bananas'])
    allow(@censusTractObject).to receive(:touches_geoids).and_return(['bananas'])
    allow(@censusTractObject).to receive(:st_union_geoids_centroid).and_return(generate(:point))

    stub_const("#{CeqrData}::TrafficZone", @trafficZoneMock)
    stub_const("#{CeqrData}::CensusTract", @censusTractMock)
  end

    # bbl within district 1 subdistrict 15
  let(:project) { create(:project, build_year: 2026, bbls: [1000477501]) }
  let(:analysis) { create(:transportation_analysis, project: project) }

  describe "#create" do
    it "sets traffic zone on create" do      
      expect(analysis.traffic_zone).to be(2)
    end

    it "sets traffic zone to max if given multiple" do
      allow(@trafficZoneObject).to receive(:for_geom).and_return([2, 4])
      expect(analysis.traffic_zone).to be(4)
    end

    it "sets required study selection based on project study area" do
      # required_jtw_study_selection = CeqrData::NycCensusTracts.version(testVersion).for_geom(project.bbls_geom)
      expect(analysis.required_jtw_study_selection).to eq(["36061000700"])
    end

    it "sets the geographic centroid of the study area" do
      expect(analysis.jtw_study_area_centroid).to be_present
    end

    it "sets the default study selection based on required study selection" do
      # jtw_study_selection = CeqrData::NycCensusTracts.version(testVersion).touches_geoids(self.required_jtw_study_selection)
      expect(analysis.jtw_study_selection).to eq(["36047000100", "36061001300", "36061001502", "36061000900", "36047000301"])
    end
  end

  describe "#save" do
    it "updates the study area when changing the study selection" do
      analysis.jtw_study_selection = ['foo', 'bar']
      analysis.save!
      expect(analysis.jtw_study_area_centroid).to be_present
    end
  end

  describe "#load_data!" do
    it "sets traffic zone if successful" do
      allow(@trafficZoneObject).to receive(:for_geom).and_return([3])

      expect(analysis.traffic_zone).to be(3)
    end
  end
end
