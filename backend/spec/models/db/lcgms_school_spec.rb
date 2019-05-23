require 'rails_helper'

RSpec.describe Db::LcgmsSchool, type: :model do  
  describe "attributes by version" do
    def test_version(version)
      Db::LcgmsSchool.version = version
      db = Db::LcgmsSchool.first

      expect(db.ps_enroll).to be_an Integer
      expect(db.is_enroll).to be_an Integer
      expect(db.hs_enroll).to be_an Integer

      expect(db.name).to be_a String
      expect(db.bldg_id).to be_a String
      expect(db.org_id).to be_a String
      expect(db.org_level).to be_a String
      expect(db.address).to be_a String
      expect(db.grades).to be_a String

      expect(db.geom.geometry_type).to be RGeo::Feature::Point
      expect(db.geom.srid).to eq(4326)
    end

    it "2017" do
      test_version(2017)
    end

    it "2018" do
      test_version(2018)
    end
  end
end