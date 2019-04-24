require 'rails_helper'

RSpec.describe Db::Bbl, type: :model do
  describe "attributes by version" do
    it "18v2" do
      Db::Bbl.version = "18v2"
      bbl = Db::Bbl.first

      expect(bbl.bbl).to be_an Integer

      expect(bbl.geom.geometry_type).to be RGeo::Feature::MultiPolygon
      expect(bbl.geom.srid).to eq(4326)
    end
  end
  
  describe ".st_union_bbls" do
    it "returns a unioned, MultiPolygon representation of the given bbls" do
      geom = Db::Bbl.st_union_bbls([1000477501, 1000480001])

      expect(geom.srid).to eq(4326)
      expect(geom.geometry_type).to be RGeo::Feature::MultiPolygon
    end
  end

  describe ".version" do
    it "returns the version of mappluto being used" do
      version = Db::Bbl.dataset_version

      expect(version).to eq("mappluto_18v2")
    end
  end
end