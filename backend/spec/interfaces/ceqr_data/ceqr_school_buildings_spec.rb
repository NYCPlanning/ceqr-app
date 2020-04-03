require 'rails_helper'

RSpec.describe "CeqrData Ceqr School Buildings", type: :model do
  ### CEQR_SCHOOL_BUILDINGS
  context "ceqr_school_buildings" do
    let(:ceqr_school_buildings_2019) { CeqrData::CeqrSchoolBuildings.version('2019') }
    let(:ceqr_school_buildings_2018) { CeqrData::CeqrSchoolBuildings.version('2018') }
    let(:ceqr_school_buildings_2017) { CeqrData::CeqrSchoolBuildings.version('2017') }

    ### PRIMARY SCHOOL ceqr_school_buildings VERSION 2018
    it "returns an array of ceqr_school_buildings that match subdistrict VERSION 2018" do
      subdistricts = ["(2,1)"]

      ps_schools = ceqr_school_buildings_2018.primary_schools_in_subdistricts(subdistricts)

      expect(ps_schools.first[:district]).to be_an Integer
      expect(ps_schools.first[:subdistrict]).to be_an Integer
      expect(ps_schools.first[:borocode]).to be_an Integer

      expect(ps_schools.first[:pc]).to be_an Integer
      expect(ps_schools.first[:pe]).to be_an Integer
      expect(ps_schools.first[:ic]).to be_an Integer
      expect(ps_schools.first[:ie]).to be_an Integer
      expect(ps_schools.first[:hc]).to be_an Integer
      expect(ps_schools.first[:he]).to be_an Integer

      expect(ps_schools.first[:bldg_name]).to be_a String
      expect(ps_schools.first[:bldg_id]).to be_a String
      expect(ps_schools.first[:org_id]).to be_a String
      expect(ps_schools.first[:org_level]).to be_a String
      expect(ps_schools.first[:address]).to be_a String
      expect(ps_schools.first[:source]).to be_a String

      expect(ps_schools.first[:excluded]).to be_in([true, false])

      expect(ps_schools.first[:district]).to eq(2)
      expect(ps_schools.first[:subdistrict]).to eq(1)
    end

    ### PRIMARY SCHOOL ceqr_school_buildings VERSION 2017
    it "returns an array of ceqr_school_buildings that match subdistrict VERSION 2017" do
      subdistricts = ["(2,1)"]

      ps_schools = ceqr_school_buildings_2017.primary_schools_in_subdistricts(subdistricts)

      expect(ps_schools.first[:district]).to be_an Integer
      expect(ps_schools.first[:subdistrict]).to be_an Integer
      expect(ps_schools.first[:borocode]).to be_an Integer

      expect(ps_schools.first[:pc]).to be_an Integer
      expect(ps_schools.first[:pe]).to be_an Integer
      expect(ps_schools.first[:ic]).to be_an Integer
      expect(ps_schools.first[:ie]).to be_an Integer
      expect(ps_schools.first[:hc]).to be_an Integer
      expect(ps_schools.first[:he]).to be_an Integer

      expect(ps_schools.first[:bldg_name]).to be_a String
      expect(ps_schools.first[:bldg_id]).to be_a String
      expect(ps_schools.first[:org_id]).to be_a String
      expect(ps_schools.first[:org_level]).to be_a String
      expect(ps_schools.first[:address]).to be_a String
      expect(ps_schools.first[:source]).to be_a String

      expect(ps_schools.first[:excluded]).to be_in([true, false])

      expect(ps_schools.first[:district]).to eq(2)
      expect(ps_schools.first[:subdistrict]).to eq(1)
    end

    ### INTERMEDIATE SCHOOL ceqr_school_buildings VERSION 2018
    it "returns an array of intermediate ceqr_school_buildings that match subdistrict for VERSION 2018" do
      subdistricts = ["(2,1)"]

      is_schools = ceqr_school_buildings_2018.intermediate_schools_in_subdistricts(subdistricts)

      expect(is_schools.first[:district]).to be_an Integer
      expect(is_schools.first[:subdistrict]).to be_an Integer
      expect(is_schools.first[:borocode]).to be_an Integer

      expect(is_schools.first[:pc]).to be_an Integer
      expect(is_schools.first[:pe]).to be_an Integer
      expect(is_schools.first[:ic]).to be_an Integer
      expect(is_schools.first[:ie]).to be_an Integer
      expect(is_schools.first[:hc]).to be_an Integer
      expect(is_schools.first[:he]).to be_an Integer

      expect(is_schools.first[:bldg_name]).to be_a String
      expect(is_schools.first[:bldg_id]).to be_a String
      expect(is_schools.first[:org_id]).to be_a String
      expect(is_schools.first[:org_level]).to be_a String
      expect(is_schools.first[:address]).to be_a String
      expect(is_schools.first[:source]).to be_a String

      expect(is_schools.first[:excluded]).to be_in([true, false])

      expect(is_schools.first[:district]).to eq(2)
      expect(is_schools.first[:subdistrict]).to eq(1)
    end

    ### INTERMEDIATE SCHOOL ceqr_school_buildings VERSION 2017
    it "returns an array of intermediate ceqr_school_buildings that match subdistrict for VERSION 2017" do
      subdistricts = ["(2,1)"]

      is_schools = ceqr_school_buildings_2017.intermediate_schools_in_subdistricts(subdistricts)

      expect(is_schools.first[:district]).to be_an Integer
      expect(is_schools.first[:subdistrict]).to be_an Integer
      expect(is_schools.first[:borocode]).to be_an Integer

      expect(is_schools.first[:pc]).to be_an Integer
      expect(is_schools.first[:pe]).to be_an Integer
      expect(is_schools.first[:ic]).to be_an Integer
      expect(is_schools.first[:ie]).to be_an Integer
      expect(is_schools.first[:hc]).to be_an Integer
      expect(is_schools.first[:he]).to be_an Integer

      expect(is_schools.first[:bldg_name]).to be_a String
      expect(is_schools.first[:bldg_id]).to be_a String
      expect(is_schools.first[:org_id]).to be_a String
      expect(is_schools.first[:org_level]).to be_a String
      expect(is_schools.first[:address]).to be_a String
      expect(is_schools.first[:source]).to be_a String

      expect(is_schools.first[:excluded]).to be_in([true, false])

      expect(is_schools.first[:district]).to eq(2)
      expect(is_schools.first[:subdistrict]).to eq(1)
    end

    ### HIGH SCHOOL ceqr_school_buildings VERSION 2018
    it "returns an array of high school ceqr_school_buildings that match borough for VERSION 2018" do
      boroIntegers = [1, 2]

      hs_schools = ceqr_school_buildings_2018.high_schools_in_boro(boroIntegers)

      expect(hs_schools.first[:district]).to be_an Integer
      expect(hs_schools.first[:subdistrict]).to be_an Integer
      expect(hs_schools.first[:borocode]).to be_an Integer

      expect(hs_schools.first[:pc]).to be_an Integer
      expect(hs_schools.first[:pe]).to be_an Integer
      expect(hs_schools.first[:ic]).to be_an Integer
      expect(hs_schools.first[:ie]).to be_an Integer
      expect(hs_schools.first[:hc]).to be_an Integer
      expect(hs_schools.first[:he]).to be_an Integer

      expect(hs_schools.first[:bldg_name]).to be_a String
      expect(hs_schools.first[:bldg_id]).to be_a String
      expect(hs_schools.first[:org_id]).to be_a String
      expect(hs_schools.first[:org_level]).to be_a String
      expect(hs_schools.first[:address]).to be_a String
      expect(hs_schools.first[:source]).to be_a String

      hs_schools_unique_borocodes = hs_schools.map {|x| x[:borocode]}.uniq.sort! # [1, 2]

      expect(hs_schools_unique_borocodes).to eq([1, 2])
    end


    ### HIGH SCHOOL ceqr_school_buildings VERSION 2017
    it "returns an array of high school ceqr_school_buildings that match borough for VERSION 2017" do
      boroIntegers = [1, 2]

      hs_schools = ceqr_school_buildings_2017.high_schools_in_boro(boroIntegers)

      expect(hs_schools.first[:district]).to be_an Integer
      expect(hs_schools.first[:subdistrict]).to be_an Integer
      expect(hs_schools.first[:borocode]).to be_an Integer

      expect(hs_schools.first[:pc]).to be_an Integer
      expect(hs_schools.first[:pe]).to be_an Integer
      expect(hs_schools.first[:ic]).to be_an Integer
      expect(hs_schools.first[:ie]).to be_an Integer
      expect(hs_schools.first[:hc]).to be_an Integer
      expect(hs_schools.first[:he]).to be_an Integer

      expect(hs_schools.first[:bldg_name]).to be_a String
      expect(hs_schools.first[:bldg_id]).to be_a String
      expect(hs_schools.first[:org_id]).to be_a String
      expect(hs_schools.first[:org_level]).to be_a String
      expect(hs_schools.first[:address]).to be_a String
      expect(hs_schools.first[:source]).to be_a String

      hs_schools_unique_borocodes = hs_schools.map {|x| x[:borocode]}.uniq.sort! # [1, 2]

      expect(hs_schools_unique_borocodes).to eq([1, 2])
    end

 end
end