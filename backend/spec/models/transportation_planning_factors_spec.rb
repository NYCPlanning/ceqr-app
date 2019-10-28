require 'rails_helper'

RSpec.describe TransportationPlanningFactors, type: :model do
  context "when residential land use" do
    it "sets defaults correctly" do
      project = create(:project, total_units: 300)

      factor_land_uses = project.transportation_analysis.transportation_planning_factors.map &:land_use
      factors = project.transportation_analysis.transportation_planning_factors.find_by(land_use: "residential")

      expect(factor_land_uses).to eq(["residential"])
      expect(factors.data_package.package).to eq("nyc_acs")
      expect(factors.census_tract_variables).to_not be_empty
    end
  end

  context "when office land use" do
    it "sets defaults correctly" do
      project = create(:project, commercial_land_use: [{"type": "office"}])

      factor_land_uses = project.transportation_analysis.transportation_planning_factors.map &:land_use
      factors = project.transportation_analysis.transportation_planning_factors.find_by(land_use: "office")

      expect(factor_land_uses).to eq(["office"])
      expect(factors.data_package.package).to eq("ctpp")
      expect(factors.census_tract_variables).to_not be_empty
    end
  end

  context "when not residential or office land use" do
    it "does not create factor" do
      project = create(:project, commercial_land_use: [{"type": "local-retail"}])

      factor_land_uses = project.transportation_analysis.transportation_planning_factors.map &:land_use
      factor = project.transportation_analysis.transportation_planning_factors.find_by(land_use: "local-retail")
      
      expect(factor).to be_nil
    end
  end

  context "when multiple land uses" do
    it "sets defaults correctly" do
      project = create(:project, total_units: 200, commercial_land_use: [
        {"type": "local-retail"},
        {"type": "office"}
      ])

      factor_land_uses = project.transportation_analysis.transportation_planning_factors.map &:land_use

      expect(factor_land_uses).to include "residential"
      expect(factor_land_uses).to include "office"
    end
  end
  
  describe "when data_package version is changed" do
  end

  describe "#refresh_census_tracts!" do
    it "updates census tracts" do
      factors = create(:transportation_planning_factors)

      expect(factors).to receive(:set_census_tract_variables)
      expect(factors).to receive(:save!)
    
      factors.refresh_census_tracts!
    end
  end
end
