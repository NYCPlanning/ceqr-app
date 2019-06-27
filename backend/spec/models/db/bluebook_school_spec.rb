require 'rails_helper'

RSpec.describe Db::BluebookSchool, type: :model do
  describe "attributes by version" do
    def test_version(version)
      Db::BluebookSchool.version = version
      bluebook = Db::BluebookSchool.first

      expect(bluebook.district).to be_an Integer
      expect(bluebook.subdistrict).to be_an Integer
      expect(bluebook.borocode).to be_an Integer

      expect(bluebook.ps_capacity).to be_an Integer
      expect(bluebook.ps_enroll).to be_an Integer
      expect(bluebook.ms_capacity).to be_an Integer
      expect(bluebook.ms_enroll).to be_an Integer
      expect(bluebook.hs_capacity).to be_an Integer
      expect(bluebook.hs_enroll).to be_an Integer

      expect(bluebook.bldg_name).to be_a String
      expect(bluebook.bldg_id).to be_a String
      expect(bluebook.org_id).to be_a String
      expect(bluebook.org_level).to be_a String
      expect(bluebook.address).to be_a String

      expect(bluebook.excluded).to be_in([true, false])

      expect(bluebook.geom.geometry_type).to be RGeo::Feature::Point
      expect(bluebook.geom.srid).to eq(4326)
    end

    it "2017" do
      test_version(2017)
    end

    it "2018" do
      test_version(2018)
    end
  end

  describe "#ps_in_subdistricts" do
    it "returns an array of bluebooks that match subdistrict" do
      subdistricts = ["(2,1)"]

      ps_schools = Db::BluebookSchool.ps_in_subdistricts(subdistricts)

      expect(ps_schools[0].district).to eq(2)
      expect(ps_schools[0].subdistrict).to eq(1)
    end
  end

  describe "#is_in_subdistricts" do
    it "returns an array of bluebooks that match subdistrict" do
      subdistricts = ["(2,1)"]

      is_schools = Db::BluebookSchool.is_in_subdistricts(subdistricts)

      expect(is_schools[0].district).to eq(2)
      expect(is_schools[0].subdistrict).to eq(1)
    end
  end

  describe "#high_schools_in_boro" do
    it "returns an array of bluebooks that match borough" do
      boroIntegers = [1, 2]

      hs_schools = Db::BluebookSchool.high_schools_in_boro(boroIntegers)

      hs_schools_unique_borocodes = hs_schools.map {|x| x[:borocode]}.uniq.sort! # [1, 2]

      expect(hs_schools_unique_borocodes).to eq([1, 2])
    end
  end
end
