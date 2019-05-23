require 'rails_helper'

RSpec.describe Db::EnrollmentPctBySd, type: :model do
  describe "attributes schemas" do
    it "version 2017" do
      Db::EnrollmentPctBySd.version = 2017
      db = Db::EnrollmentPctBySd.first

      expect(db.district).to be_an Integer
      expect(db.subdistrict).to be_an Integer
      expect(db.level).to be_a String
      expect(db.multiplier).to be_a Float
    end

    it "version 2018" do
      Db::EnrollmentPctBySd.version = 2018
      db = Db::EnrollmentPctBySd.first

      expect(db.district).to be_an Integer
      expect(db.subdistrict).to be_an Integer
      expect(db.level).to be_a String
      expect(db.multiplier).to be_a Float
    end
  end
end