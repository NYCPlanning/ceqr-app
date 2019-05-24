require 'rails_helper'

RSpec.describe Db::CensusTract, type: :model do
  describe "attributes by version" do
    it "2010" do
      Db::CensusTract.version = 2010
      db = Db::CensusTract.first

      expect(db.geoid).to be_an String

      expect(db.geom.geometry_type).to be RGeo::Feature::MultiPolygon
      expect(db.geom.srid).to eq(4326)
    end
  end
  
  describe ".for_geom" do
    it "returns the geoids for the input geometry" do
      geom = generate(:multi_polygon)

      geoids = Db::CensusTract.for_geom(geom)

      expect(geoids).to eq(["36061000700"])
    end
  end

  describe ".st_union_geoids_centroid" do
    it "returns a unioned multipolygon representation of the geoids" do
      geom = Db::CensusTract.st_union_geoids_centroid(["36005009300", "36081000100", "36081094202"])

      expect(geom.srid).to eq(4326)
      expect(geom.geometry_type).to be RGeo::Feature::Point
    end
  end

  describe ".version" do
    it "returns the version of census tracts being used" do
      version = Db::CensusTract.dataset_version

      expect(version).to eq("nyc_census_tracts_2010")
    end
  end
end