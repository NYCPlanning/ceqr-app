require 'rails_helper'

RSpec.describe CeqrData::NycCensusTracts, type: :model do
  let(:nyc_census_tracts) { CeqrData::NycCensusTracts.version(2010) }
  
  describe "attributes by version" do
    it "2010" do
      tract = nyc_census_tracts.query.first

      expect(tract[:geoid]).to be_a String

      geom = nyc_census_tracts.parse_wkb(tract[:geom])

      expect(geom.geometry_type).to be RGeo::Feature::MultiPolygon
      expect(geom.srid).to eq(4326)
    end
  end
  
  describe "#for_geom" do
    it "returns the geoids for the input geometry" do
      geom = generate(:multi_polygon)

      geoids = nyc_census_tracts.for_geom(geom)

      expect(geoids).to eq(["36061000700"])
    end
  end

  describe "#st_union_geoids_centroid" do
    it "returns a unioned multipolygon representation of the geoids" do
      geom = nyc_census_tracts.st_union_geoids_centroid(["36005009300", "36081000100", "36081094202"])

      expect(geom.srid).to eq(4326)
      expect(geom.geometry_type).to be RGeo::Feature::Point
    end
  end

  describe "#touches_geoids" do
    it "returns all geoids that touch study area geoids" do
      geoids = nyc_census_tracts.touches_geoids(["36061000700"])

      expect(geoids).to match_array(["36047000100", "36061001300", "36061001502", "36061000900", "36047000301"])
    end
  end

  describe ".version" do
    it "returns the version of census tracts being used" do
      version = nyc_census_tracts.version

      expect(version).to eq(2010)
    end
  end
end