require 'rails_helper'

RSpec.describe DataPackage, type: :model do
  describe ".latest_for" do
    it "returns most recent DataPackage for a given chapter" do
      create(:data_package, analysis: "test", release_date: 1.year.ago, name: "1 Year Old")
      create(:data_package, analysis: "test", release_date: 2.years.ago, name: "2 Years Old")

      latest = DataPackage.latest_for(:test)

      expect(latest.name).to eq("1 Year Old")
    end
  end

  describe "#dataset_for()" do
    it "returns the dataset" do
      create(:data_package, analysis: "test", datasets: { "bluebook": { "table": "sca_bluebook.2018" } })
      
      dp = DataPackage.latest_for(:test)

      expect(dp.dataset_for("bluebook")).to eq("sca_bluebook")
    end
  end

  describe "#version_for()" do
    it "returns the version" do
      create(:data_package, analysis: "test", datasets: { "bluebook": { "table": "sca_bluebook.2018" } })
      
      dp = DataPackage.latest_for(:test)

      expect(dp.version_for("bluebook")).to eq("2018")
    end
  end

  describe "#table_name_for()" do
    it "returns the full table name" do
      create(:data_package, analysis: "test", datasets: { "bluebook": { "table": "sca_bluebook.2018" } })
      
      dp = DataPackage.latest_for(:test)

      expect(dp.table_name_for("bluebook")).to eq("sca_bluebook.2018")
    end
  end
end
