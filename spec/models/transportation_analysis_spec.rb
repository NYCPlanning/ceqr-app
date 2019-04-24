require 'rails_helper'

RSpec.describe TransportationAnalysis, type: :model do    
  before do
    @ceqr_data = class_double('TrafficZone')
    allow(@ceqr_data).to receive(:for_geom).and_return([2])

    stub_const("#{Db}::TrafficZone", @ceqr_data)
  end
  
  let(:project) { create(:project) }
  let(:analysis) { create(:transportation_analysis, project: project) }

  describe "#create" do
    it "sets traffic zone on create" do      
      expect(analysis.traffic_zone).to be(2)
    end

    it "sets traffic zone to max if given multiple" do
      allow(@ceqr_data).to receive(:for_geom).and_return([2, 4])
      expect(analysis.traffic_zone).to be(4)
    end
  end
  
  describe "#load_data!" do
    it "sets traffic zone if successful" do
      allow(@ceqr_data).to receive(:for_geom).and_return([3])

      expect(analysis.traffic_zone).to be(3)
    end
  end
end
