require 'rails_helper'

RSpec.describe "Traffic Zone", type: :model do
  context "traffic zone" do
    let(:traffic_zone_2014) { CeqrData::TrafficZone.version('2014') }
  
    it "returns traffic zone for a given geom VERSION 2014" do
      geom = RGeo::Cartesian.preferred_factory(srid: 4326).parse_wkt("MULTIPOLYGON (((-74.0099084890881 40.708117924001066, -74.01022903213298 40.70775652803635, -74.01112059856906 40.708288226011604, -74.01079076752514 40.708695737776026, -74.0099084890881 40.708117924001066)))")

      zones = traffic_zone_2014.for_geom(geom)

      expect(zones.first).to be_an Integer

      expect(zones).to eq([1])
    end

  end
end