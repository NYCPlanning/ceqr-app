require 'rails_helper'

RSpec.describe Db::TrafficZone, type: :model do
  describe "attributes by version" do
    it "2014" do
      Db::TrafficZone.version = 2014
      db = Db::TrafficZone.first

      expect(db.zone).to be_an Integer

      expect(db.geom.geometry_type).to be RGeo::Feature::MultiPolygon
      expect(db.geom.srid).to eq(4326)
    end
  end
  
  describe ".for_geom" do
    it "returns traffic zone for a given geom" do
      geom = RGeo::Cartesian.preferred_factory(srid: 4326).parse_wkt("MULTIPOLYGON (((-74.0099084890881 40.708117924001066, -74.01022903213298 40.70775652803635, -74.01112059856906 40.708288226011604, -74.01079076752514 40.708695737776026, -74.0099084890881 40.708117924001066)))")

      zones = Db::TrafficZone.for_geom(geom)

      expect(zones).to eq([1])
    end
  end

  describe ".version" do
    it "returns the version of mappluto being used" do
      version = Db::TrafficZone.dataset_version

      expect(version).to eq("traffic_zones_2014")
    end
  end
end