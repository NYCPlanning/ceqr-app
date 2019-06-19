require 'rails_helper'

RSpec.describe Db::SchoolSubdistrict, type: :model do
  describe "attributes by version" do
    it "2017" do
      Db::SchoolSubdistrict.version = "2017"
      db = Db::SchoolSubdistrict.order('RANDOM()').first

      expect(db.district).to be_an Integer
      expect(db.subdistrict).to be_an Integer
      expect(db.name).to be_a String
      expect(db.school_choice_note.class).to be_in [String, NilClass]
      expect(db.school_choice_ps).to be_in([true, false, nil])
      expect(db.school_choice_is).to be_in([true, false, nil])

      expect(db.geom.geometry_type).to be RGeo::Feature::MultiPolygon
      expect(db.geom.srid).to eq(4326)
    end
  end

  describe "#intersecting_with" do
    it "returns an array of subdistricts intersecting with a given polygon" do
      geom = RGeo::Cartesian.preferred_factory(srid: 4326).parse_wkt("MULTIPOLYGON (((-74.0099084890881 40.708117924001066, -74.01022903213298 40.70775652803635, -74.01112059856906 40.708288226011604, -74.01079076752514 40.708695737776026, -74.0099084890881 40.708117924001066)))")
      
      subdistricts = Db::SchoolSubdistrict.intersecting_with(geom)

      expect(subdistricts[0].district).to eq(2)
      expect(subdistricts[0].subdistrict).to eq(1)
    end
  end
end