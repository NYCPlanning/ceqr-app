require 'rails_helper'

RSpec.describe "CeqrData School Subdistrict", type: :model do
  context "school subdistrict" do
    let(:school_subdistrict_2017) { CeqrData::DoeSchoolSubdistricts.version('2017') }

    it "returns an array of subdistricts intersecting with a given polygon" do
      geom = RGeo::Cartesian.preferred_factory(srid: 4326).parse_wkt("MULTIPOLYGON (((-74.0099084890881 40.708117924001066, -74.01022903213298 40.70775652803635, -74.01112059856906 40.708288226011604, -74.01079076752514 40.708695737776026, -74.0099084890881 40.708117924001066)))")

      subdistricts = school_subdistrict_2017.intersecting_with_bbls(geom)

      expect(subdistricts.first[:district]).to be_an Integer
      expect(subdistricts.first[:subdistrict]).to be_an Integer
      # currently not pulling :name
      # expect(subdistricts.first[:name]).to be_a String
      expect(subdistricts.first[:school_choice_note].class).to be_in [String, NilClass]
      expect(subdistricts.first[:school_choice_ps]).to be_in([true, false, nil])
      expect(subdistricts.first[:school_choice_is]).to be_in([true, false, nil])

      # with Sequel, geometry is formatted as WKB
      geometry_wkb = subdistricts.first[:geom]
      expect(geometry_wkb).to be_a String

      # geometry parsed
      geometry_parsed = RGeo::WKRep::WKBParser.new(nil, support_ewkb: true).parse(geometry_wkb)
      expect(geometry_parsed.geometry_type).to be RGeo::Feature::MultiPolygon
      expect(geometry_parsed.srid).to eq(4326)

      expect(subdistricts.first[:district]).to eq(2)
      expect(subdistricts.first[:subdistrict]).to eq(1)
    end

    it "returns an array of subdistricts matching given pairs of districts & subdistricts" do
      subdistrict_pairs = ["(1,2)"]

      subdistricts = school_subdistrict_2017.for_subdistrict_pairs(subdistrict_pairs)

      expect(subdistricts.first[:district]).to be_an Integer
      expect(subdistricts.first[:subdistrict]).to be_an Integer
      # currently not pulling :name
      # expect(subdistricts.first[:name]).to be_a String
      expect(subdistricts.first[:school_choice_note].class).to be_in [String, NilClass]
      expect(subdistricts.first[:school_choice_ps]).to be_in([true, false, nil])
      expect(subdistricts.first[:school_choice_is]).to be_in([true, false, nil])

      expect(subdistricts.first[:geom].geometry_type).to be RGeo::Feature::MultiPolygon
      expect(subdistricts.first[:geom].srid).to eq(4326)

      expect(subdistricts[0][:district]).to eq(1)
      expect(subdistricts[0][:subdistrict]).to eq(2)
      expect(subdistricts[0][:school_choice_ps]).to eq(true)
      expect(subdistricts[0][:school_choice_is]).to eq(true)
    end

 end
end
