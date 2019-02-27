require 'rails_helper'

RSpec.describe CeqrData::Bbl, type: :model do
  describe ".st_union_bbls" do
    it "returns a unioned, MultiPolygon representation of the given bbls" do
      geom = CeqrData::Bbl.st_union_bbls([1000477501, 1000480001])

      expect(geom.srid).to eq(4326)
      expect(geom.geometry_type).to be(RGeo::Feature::MultiPolygon)
    end
  end

  describe ".version" do
    it "returns the version of mappluto being used" do
      version = CeqrData::Bbl.version

      expect(version).to eq("mappluto_18v2")
    end
  end
end