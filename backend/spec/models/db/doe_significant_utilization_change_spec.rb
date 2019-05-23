require 'rails_helper'

RSpec.describe Db::DoeSignificantUtilizationChange, type: :model do
  describe "attributes by version" do
    def test_version(version)
      Db::DoeSignificantUtilizationChange.version = version
      db = Db::DoeSignificantUtilizationChange.first

      expect(db.bldg_id).to be_a String
      expect(db.bldg_id_additional).to be_a String
      expect(db.org_id).to be_a String
      expect(db.title).to be_a String

      expect(db.at_scale_year).to be_a String
      expect(db.url).to be_a String
      expect(db.vote_date).to be_a String

      expect(db.at_scale_enroll).to be_a Integer
    end

    it "062018" do
      test_version("062018")
    end
  end
end