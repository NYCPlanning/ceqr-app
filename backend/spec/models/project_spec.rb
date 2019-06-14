require 'rails_helper'

RSpec.describe Project, type: :model do
  before do    
    @ceqr_data = class_double('TrafficZone')
    allow(@ceqr_data).to receive(:for_geom).and_return([2])

    stub_const("#{Db}::TrafficZone", @ceqr_data)
  end
  
  describe "#create" do
    it "creates a public schools analysis" do
      expect { create(:project) }.to change { PublicSchoolsAnalysis.count }.by(1)
    end

    it "creates a transportation analysis" do
      expect { create(:project) }.to change { TransportationAnalysis.count }.by(1)
    end

    it "creates a community facilities analysis" do
      expect { create(:project) }.to change { CommunityFacilitiesAnalysis.count }.by(1)
    end
  end

  describe "#borough" do
    it "returns the correct Borough" do
      project = create(:project)

      project.bbls = [1234123442]
      expect(project.borough).to eq("Manhattan")

      project.bbls = [2234123442]
      expect(project.borough).to eq("Bronx")

      project.bbls = [3234123442]
      expect(project.borough).to eq("Brooklyn")

      project.bbls = [4234123442]
      expect(project.borough).to eq("Queens")

      project.bbls = [5234123442]
      expect(project.borough).to eq("Staten Island")
    end
  end

  describe "#refresh_analysis!" do
    it "loads new Transportation data if bbls have changed" do
      project = create(:project)

      expect(project.transportation_analysis).to receive(:load_data!)

      project.bbls = [3019790030]
      project.save
    end

    it "does not load new Transportation data if bbls have not changed" do
      project = create(:project)

      expect(project.transportation_analysis).not_to receive(:load_data!)

      project.bbls = attributes_for(:project)[:bbls]
      project.save
    end
  end
end
