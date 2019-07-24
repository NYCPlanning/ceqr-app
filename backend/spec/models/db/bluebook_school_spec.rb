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
end
