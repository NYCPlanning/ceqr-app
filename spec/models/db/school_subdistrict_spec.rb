require 'rails_helper'

RSpec.describe Db::SchoolSubdistrict, type: :model do
  describe "attributes by version" do
    it "2017" do
      Db::SchoolSubdistrict.version = "2017"
      db = Db::SchoolSubdistrict.order('RANDOM()').first

      expect(db.district).to be_an Integer
      expect(db.subdistrict).to be_an Integer
      expect(db.name).to be_a String
      expect(db.school_choice_note.class).to be_in [String, NilClass]
      expect(db.school_choice_ps).to be_in([true, false, nil])
      expect(db.school_choice_is).to be_in([true, false, nil])

      expect(db.geom.geometry_type).to be RGeo::Feature::MultiPolygon
      expect(db.geom.srid).to eq(4326)
    end
  end
end