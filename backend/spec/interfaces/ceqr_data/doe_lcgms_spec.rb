require 'rails_helper'

RSpec.describe "CeqrData Doe Lcgms", type: :model do
  ### LCGMS SCHOOLS
  context "All Lcgms Schools" do
    let(:lcgms_school_2018) { CeqrData::DoeLcgms.version('2018') }
    let(:lcgms_school_2017) { CeqrData::DoeLcgms.version('2017') }
    let(:school_subdistrict) { CeqrData::DoeSchoolSubdistricts.version('2017') }

    # lcgms_schools VERSION 2018
    it "returns an array of lcmgs schools that match subdistrict VERSION 2018" do
      subdistrict_pairs = ["(9,1)"]

      subdistricts = school_subdistrict.for_subdistrict_pairs(subdistrict_pairs)

      geometry = subdistricts.map {|x| x[:geom]}

      lcgms_schools = lcgms_school_2018.lcgms_intersecting_subdistrict_geom(geometry.first)

      expect(lcgms_schools.first[:ps_enroll]).to be_an Integer
      expect(lcgms_schools.first[:is_enroll]).to be_an Integer
      expect(lcgms_schools.first[:hs_enroll]).to be_an Integer

      expect(lcgms_schools.first[:name]).to be_a String
      expect(lcgms_schools.first[:bldg_id]).to be_a String
      expect(lcgms_schools.first[:org_id]).to be_a String
      expect(lcgms_schools.first[:org_level]).to be_a String
      expect(lcgms_schools.first[:address]).to be_a String
      # grades is nil for newer datasets
      # expect(lcgms_schools.first[:grades]).to be_a String

      expect(lcgms_schools.first[:bldg_id]).to eq('X145')
    end

    # lcgms_schools VERSION 2017
    it "returns an array of lcmgs schools that match subdistrict VERSION 2017" do
      subdistrict_pairs = ["(2,3)"]

      subdistricts = school_subdistrict.for_subdistrict_pairs(subdistrict_pairs)

      geometry = subdistricts.map {|x| x[:geom]}

      lcgms_schools = lcgms_school_2017.lcgms_intersecting_subdistrict_geom(geometry.first)

      expect(lcgms_schools.first[:ps_enroll]).to be_an Integer
      expect(lcgms_schools.first[:is_enroll]).to be_an Integer
      expect(lcgms_schools.first[:hs_enroll]).to be_an Integer

      expect(lcgms_schools.first[:name]).to be_a String
      expect(lcgms_schools.first[:bldg_id]).to be_a String
      expect(lcgms_schools.first[:org_id]).to be_a String
      expect(lcgms_schools.first[:org_level]).to be_a String
      expect(lcgms_schools.first[:address]).to be_a String
      expect(lcgms_schools.first[:grades]).to be_a String

      expect(lcgms_schools.first[:bldg_id]).to eq('M323')
    end
  end
end
