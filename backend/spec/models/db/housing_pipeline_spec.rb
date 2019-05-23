require 'rails_helper'

RSpec.describe "Db::HousingPipeline", type: :model do
  describe "attributes by version" do
    context "by school districts" do      
      def tests_version(version)
        Db::HousingPipelineBySd.version = version
        db = Db::HousingPipelineBySd.first
      
        expect(db.district).to be_a String
        expect(db.subdistrict).to be_an String
        expect(db.new_students).to be_an Integer
        expect(db.org_level).to be_a String
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
        Db::HousingPipelineByBoro.version = version
        db = Db::HousingPipelineByBoro.first
      
        expect(db.borough).to be_a String
        expect(db.new_students).to be_an Integer
        expect(db.borocode).to be_an Integer
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