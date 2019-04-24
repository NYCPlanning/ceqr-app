require 'rails_helper'

RSpec.describe "Db::EnrollmentProjection", type: :model do
  describe "attributes by version" do
    context "by school districts" do      
      def tests_version(version)
        Db::EnrollmentProjectionBySd.version = version
        db = Db::EnrollmentProjectionBySd.first
      
        expect(db.district).to be_a String
        expect(db.ps).to be_an Integer
        expect(db.is).to be_an Integer
        expect(db.school_year).to be_a String
      end
      
      it "sd_2017" do
        tests_version("sd_2017")
      end

      it "sd_2018" do
        tests_version("sd_2018")
      end
    end

    context "by boroughs" do
      def tests_version(version)
        Db::EnrollmentProjectionByBoro.version = version
        db = Db::EnrollmentProjectionByBoro.first
      
        expect(db.borough).to be_a String
        expect(db.hs).to be_an Integer
        expect(db.year).to be_a String
      end
      
      it "boro_2017" do
        tests_version("boro_2017")
      end

      it "boro_2018" do
        tests_version("boro_2018")
      end
    end
  end
end

