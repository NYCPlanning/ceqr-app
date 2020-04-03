require 'rails_helper'

RSpec.describe DataPackage, type: :model do
  describe ".latest_for" do
    it "returns most recent DataPackage for a given chapter" do
      create(:data_package, package: "test", release_date: 1.year.ago, name: "1 Year Old")
      create(:data_package, package: "test", release_date: 2.years.ago, name: "2 Years Old")

      latest = DataPackage.latest_for(:test)

      expect(latest.name).to eq("1 Year Old")
    end
  end

  describe "#table_for()" do
    it "returns the table name" do
      create(:data_package, package: "test", schemas: { "ceqr_school_buildings": { "table": "2018" } })
      
      dp = DataPackage.latest_for(:test)

      expect(dp.table_for("ceqr_school_buildings")).to eq("2018")
    end
  end
end
