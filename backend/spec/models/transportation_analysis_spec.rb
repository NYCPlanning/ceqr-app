require 'rails_helper'

RSpec.describe TransportationAnalysis, type: :model do    
  # bbl within district 1 subdistrict 15
  let(:project) { create(:project, build_year: 2026, bbls: [1000477501]) }
  let(:analysis) { create(:transportation_analysis, project: project) }

  describe "#compute_for_updated_bbls!" do
    it "updates all attributes and saves analysis" do
      expect(analysis).to receive(:set_initial_analysis_data)
      expect(analysis).to receive(:save!)

      analysis.compute_for_updated_bbls!
    end
  end

  describe "#selected_census_tract_geoids" do
    it "returns all census tract geoids in the analysis" do
      analysis.required_census_tracts_selection = ["36047000100"]
      analysis.census_tracts_selection = ["36061001300", "36061001502"]

      expect(analysis.selected_census_tract_geoids).to eq(["36047000100", "36061001300", "36061001502"])
    end
  end

  describe "#set_transportation_planning_factors" do
    let(:project) do
      create(:project, 
        total_units: 200,
        commercial_land_use: [{"type": "office"}]
      )
    end
  
    it "creates planning factor models for all land uses" do
      factors = project.transportation_analysis.transportation_planning_factors
      land_uses = factors.map &:land_use

      expect(land_uses.count).to eq 2
      expect(land_uses).to include('residential')
      expect(land_uses).to include('office')
    end


    it "deletes planning factor models for land uses no longer active" do
      project.total_units = 0
      project.save

      factors = project.transportation_analysis.transportation_planning_factors.reload
      land_uses = factors.map &:land_use

      expect(land_uses.count).to eq 1
      expect(land_uses).to_not include('residential')
      expect(land_uses).to include('office')
    end


    it "does nothing if land uses are already created" do
      project.total_units = 100
      project.save

      factors = project.transportation_analysis.transportation_planning_factors
      land_uses = factors.map &:land_use

      expect(land_uses.count).to eq 2
      expect(land_uses).to include('residential')
      expect(land_uses).to include('office')
    end
  end


  describe "updating project attributes" do
    context "when census tract selection changes" do
      it "does not update centroid when tract selection is not changed" do
        expect { analysis.save }.not_to change { analysis.census_tracts_centroid }
      end
    end

    describe "creating an analysis" do
      it "creates necessary TransportationPlanningFactors models" do
        project = create(:project, total_units: 200)
        analysis = project.transportation_analysis
        
        expect(analysis.transportation_planning_factors.count).to be > 0
      end
      
      it "sets traffic zone on create" do      
        expect(analysis.traffic_zone).to be(1)
      end
  
      it "sets required study selection based on project study area" do
        expect(analysis.required_census_tracts_selection).to eq(["36061000700"])
      end
  
      it "sets the geographic centroid of the study area" do
        expect(analysis.census_tracts_centroid).to be_present
      end
  
      it "sets the default study selection based on required study selection" do
        expect(analysis.census_tracts_selection).to eq(["36047000100", "36061001300", "36061001502", "36061000900", "36047000301"])
      end
    end
  end

  describe "#set_initial_analysis_data" do
    it "sets traffic zone" do
      expect(analysis).to receive(:set_traffic_zone)
    
      analysis.set_initial_analysis_data
    end

    it "sets required census tract" do
      expect(analysis).to receive(:set_required_census_tracts_selection)
    
      analysis.set_initial_analysis_data
    end

    it "sets initial census tracts selection" do
      expect(analysis).to receive(:set_census_tracts_selection)
   
      analysis.set_initial_analysis_data
    end

    it "sets census tracts centroid" do
      expect(analysis).to receive(:set_census_tracts_centroid)
    
      analysis.set_initial_analysis_data
    end
  end
end
