require 'rails_helper'

RSpec.describe TransportationAnalysis, type: :model do    
  before do
    @trafficZoneMock = class_double('TrafficZone')
    allow(@trafficZoneMock).to receive(:for_geom).and_return([2])

    @censusTractMock = class_double('CensusTract')
    allow(@censusTractMock).to receive(:for_geom).and_return(['foo'])
    allow(@censusTractMock).to receive(:touches_geoids).and_return(['foo'])
    allow(@censusTractMock).to receive(:st_union_geoids_centroid).and_return(generate(:point))

    stub_const("#{Db}::TrafficZone", @trafficZoneMock)
    stub_const("#{Db}::CensusTract", @censusTractMock)
  end

  let(:project) { create(:project) }
  let(:analysis) { create(:transportation_analysis, project: project) }

  describe "#create" do
    it "sets traffic zone on create" do      
      expect(analysis.traffic_zone).to be(2)
    end

    it "sets traffic zone to max if given multiple" do
      allow(@trafficZoneMock).to receive(:for_geom).and_return([2, 4])
      expect(analysis.traffic_zone).to be(4)
    end

    it "sets required study selection based on project study area" do
      allow(@censusTractMock).to receive(:for_geom).and_return(['bar'])
      expect(analysis.required_jtw_study_selection).to eq(['bar'])
    end

    it "sets the geographic centroid of the study area" do
      expect(analysis.jtw_study_area_centroid).to be_present
    end

    it "sets the default study selection based on required study selection" do
      allow(@censusTractMock).to receive(:touches_geoids).and_return(['baz'])
      expect(analysis.jtw_study_selection).to eq(['baz'])
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
      allow(@trafficZoneMock).to receive(:for_geom).and_return([3])

      expect(analysis.traffic_zone).to be(3)
    end
  end
end
