require 'rails_helper'

RSpec.describe CeqrData::Mappluto, type: :model do
  let(:mappluto) { CeqrData::Mappluto.version("18v2") }
  
  describe "attributes by version" do
    it "18v2" do
      bbl = mappluto.query.first

      expect(bbl[:bbl]).to be_an Integer
    end
  end
  
  describe ".st_union_bbls" do
    it "returns a unioned, MultiPolygon representation of the given bbls" do
      geom = mappluto.st_union_bbls([1000477501, 1000480001])

      expect(geom.srid).to eq(4326)
      expect(geom.geometry_type).to be RGeo::Feature::MultiPolygon
    end
  end

  describe "#version" do
    it "returns the version of mappluto being used" do
      version = mappluto.version

      expect(version).to eq("18v2")
    end
  end

  describe "#dataset" do
    it "returns the name of the dataset" do
      dataset = mappluto.dataset

      expect(dataset).to eq("mappluto")
    end
  end
end