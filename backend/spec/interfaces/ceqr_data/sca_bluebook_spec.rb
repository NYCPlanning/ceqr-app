require 'rails_helper'

RSpec.describe "CeqrData Sca Bluebook", type: :model do
  ### BLUEBOOK SCHOOLS
  context "Bluebook Schools" do
    let(:sca_bluebook_2018) { CeqrData::ScaBluebook.version('2018') }
    let(:sca_bluebook_2017) { CeqrData::ScaBluebook.version('2017') }

    ### PRIMARY SCHOOL bluebook_schools VERSION 2018
    it "returns an array of bluebooks that match subdistrict VERSION 2018" do
      subdistricts = ["(2,1)"]

      ps_schools = sca_bluebook_2018.ps_schools_in_subdistricts(subdistricts)

      expect(ps_schools.first[:district]).to be_an Integer
      expect(ps_schools.first[:subdistrict]).to be_an Integer
      expect(ps_schools.first[:borocode]).to be_an Integer

      expect(ps_schools.first[:ps_capacity]).to be_an Integer
      expect(ps_schools.first[:ps_enroll]).to be_an Integer
      expect(ps_schools.first[:ms_capacity]).to be_an Integer
      expect(ps_schools.first[:ms_enroll]).to be_an Integer
      expect(ps_schools.first[:hs_capacity]).to be_an Integer
      expect(ps_schools.first[:hs_enroll]).to be_an Integer

      expect(ps_schools.first[:bldg_name]).to be_a String
      expect(ps_schools.first[:bldg_id]).to be_a String
      expect(ps_schools.first[:org_id]).to be_a String
      expect(ps_schools.first[:org_level]).to be_a String
      expect(ps_schools.first[:address]).to be_a String

      expect(ps_schools.first[:excluded]).to be_in([true, false])

      expect(ps_schools.first[:district]).to eq(2)
      expect(ps_schools.first[:subdistrict]).to eq(1)
    end

    ### PRIMARY SCHOOL bluebook_schools VERSION 2017
    it "returns an array of bluebooks that match subdistrict VERSION 2017" do
      subdistricts = ["(2,1)"]

      ps_schools = sca_bluebook_2017.ps_schools_in_subdistricts(subdistricts)

      expect(ps_schools.first[:district]).to be_an Integer
      expect(ps_schools.first[:subdistrict]).to be_an Integer
      expect(ps_schools.first[:borocode]).to be_an Integer

      expect(ps_schools.first[:ps_capacity]).to be_an Integer
      expect(ps_schools.first[:ps_enroll]).to be_an Integer
      expect(ps_schools.first[:ms_capacity]).to be_an Integer
      expect(ps_schools.first[:ms_enroll]).to be_an Integer
      expect(ps_schools.first[:hs_capacity]).to be_an Integer
      expect(ps_schools.first[:hs_enroll]).to be_an Integer

      expect(ps_schools.first[:bldg_name]).to be_a String
      expect(ps_schools.first[:bldg_id]).to be_a String
      expect(ps_schools.first[:org_id]).to be_a String
      expect(ps_schools.first[:org_level]).to be_a String
      expect(ps_schools.first[:address]).to be_a String

      expect(ps_schools.first[:excluded]).to be_in([true, false])

      expect(ps_schools.first[:district]).to eq(2)
      expect(ps_schools.first[:subdistrict]).to eq(1)
    end

    ### INTERMEDIATE SCHOOL bluebook_schools VERSION 2018
    it "returns an array of bluebooks that match subdistrict" do
      subdistricts = ["(2,1)"]

      is_schools = sca_bluebook_2018.is_schools_in_subdistricts(subdistricts)

      expect(is_schools.first[:district]).to be_an Integer
      expect(is_schools.first[:subdistrict]).to be_an Integer
      expect(is_schools.first[:borocode]).to be_an Integer

      expect(is_schools.first[:ps_capacity]).to be_an Integer
      expect(is_schools.first[:ps_enroll]).to be_an Integer
      expect(is_schools.first[:ms_capacity]).to be_an Integer
      expect(is_schools.first[:ms_enroll]).to be_an Integer
      expect(is_schools.first[:hs_capacity]).to be_an Integer
      expect(is_schools.first[:hs_enroll]).to be_an Integer

      expect(is_schools.first[:bldg_name]).to be_a String
      expect(is_schools.first[:bldg_id]).to be_a String
      expect(is_schools.first[:org_id]).to be_a String
      expect(is_schools.first[:org_level]).to be_a String
      expect(is_schools.first[:address]).to be_a String

      expect(is_schools.first[:excluded]).to be_in([true, false])

      expect(is_schools.first[:district]).to eq(2)
      expect(is_schools.first[:subdistrict]).to eq(1)
    end

    ### INTERMEDIATE SCHOOL bluebook_schools VERSION 2017
    it "returns an array of bluebooks that match subdistrict" do
      subdistricts = ["(2,1)"]

      is_schools = sca_bluebook_2017.is_schools_in_subdistricts(subdistricts)

      expect(is_schools.first[:district]).to be_an Integer
      expect(is_schools.first[:subdistrict]).to be_an Integer
      expect(is_schools.first[:borocode]).to be_an Integer

      expect(is_schools.first[:ps_capacity]).to be_an Integer
      expect(is_schools.first[:ps_enroll]).to be_an Integer
      expect(is_schools.first[:ms_capacity]).to be_an Integer
      expect(is_schools.first[:ms_enroll]).to be_an Integer
      expect(is_schools.first[:hs_capacity]).to be_an Integer
      expect(is_schools.first[:hs_enroll]).to be_an Integer

      expect(is_schools.first[:bldg_name]).to be_a String
      expect(is_schools.first[:bldg_id]).to be_a String
      expect(is_schools.first[:org_id]).to be_a String
      expect(is_schools.first[:org_level]).to be_a String
      expect(is_schools.first[:address]).to be_a String

      expect(is_schools.first[:excluded]).to be_in([true, false])

      expect(is_schools.first[:district]).to eq(2)
      expect(is_schools.first[:subdistrict]).to eq(1)
    end

    ### HIGH SCHOOL bluebook_schools VERSION 2018
    it "returns an array of bluebooks that match borough" do
      boroIntegers = [1, 2]

      hs_schools = sca_bluebook_2018.high_schools_in_boro(boroIntegers)

      expect(hs_schools.first[:district]).to be_an Integer
      expect(hs_schools.first[:subdistrict]).to be_an Integer
      expect(hs_schools.first[:borocode]).to be_an Integer

      expect(hs_schools.first[:ps_capacity]).to be_an Integer
      expect(hs_schools.first[:ps_enroll]).to be_an Integer
      expect(hs_schools.first[:ms_capacity]).to be_an Integer
      expect(hs_schools.first[:ms_enroll]).to be_an Integer
      expect(hs_schools.first[:hs_capacity]).to be_an Integer
      expect(hs_schools.first[:hs_enroll]).to be_an Integer

      expect(hs_schools.first[:bldg_name]).to be_a String
      expect(hs_schools.first[:bldg_id]).to be_a String
      expect(hs_schools.first[:org_id]).to be_a String
      expect(hs_schools.first[:org_level]).to be_a String
      expect(hs_schools.first[:address]).to be_a String

      hs_schools_unique_borocodes = hs_schools.map {|x| x[:borocode]}.uniq.sort! # [1, 2]

      expect(hs_schools_unique_borocodes).to eq([1, 2])
    end


    ### HIGH SCHOOL bluebook_schools VERSION 2017
    it "returns an array of bluebooks that match borough" do
      boroIntegers = [1, 2]

      hs_schools = sca_bluebook_2017.high_schools_in_boro(boroIntegers)

      expect(hs_schools.first[:district]).to be_an Integer
      expect(hs_schools.first[:subdistrict]).to be_an Integer
      expect(hs_schools.first[:borocode]).to be_an Integer

      expect(hs_schools.first[:ps_capacity]).to be_an Integer
      expect(hs_schools.first[:ps_enroll]).to be_an Integer
      expect(hs_schools.first[:ms_capacity]).to be_an Integer
      expect(hs_schools.first[:ms_enroll]).to be_an Integer
      expect(hs_schools.first[:hs_capacity]).to be_an Integer
      expect(hs_schools.first[:hs_enroll]).to be_an Integer

      expect(hs_schools.first[:bldg_name]).to be_a String
      expect(hs_schools.first[:bldg_id]).to be_a String
      expect(hs_schools.first[:org_id]).to be_a String
      expect(hs_schools.first[:org_level]).to be_a String
      expect(hs_schools.first[:address]).to be_a String

      hs_schools_unique_borocodes = hs_schools.map {|x| x[:borocode]}.uniq.sort! # [1, 2]

      expect(hs_schools_unique_borocodes).to eq([1, 2])
    end

 end
end

