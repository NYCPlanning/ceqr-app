require 'rails_helper'

RSpec.describe "CeqrData SCA Capital Projects", type: :model do
  context "All SCA Capital Project Schools " do
    let(:sca_capital_project_2018) { CeqrData::ScaCapitalProjects.version('2018') }
    let(:sca_capital_project_022019) { CeqrData::ScaCapitalProjects.version('022019') }
    let(:school_subdistrict) { CeqrData::DoeSchoolSubdistricts.version('2017') }

    it "returns an array of SCA schools that match subdistrict VERSION 2018" do
      subdistrict_pairs = ["(2,3)"]

      subdistricts = school_subdistrict.for_subdistrict_pairs(subdistrict_pairs)

      geometry = subdistricts.map {|x| x[:geom]}

      sca_schools = sca_capital_project_2018.sca_projects_intersecting_subdistrict_geom(geometry.first)

      expect(sca_schools.first[:project_dsf]).to be_a String
      expect(sca_schools.first[:name]).to be_a String
      expect(sca_schools.first[:org_level]).to be_a String

      expect(sca_schools.first[:capacity]).to be_an Integer
      expect(sca_schools.first[:pct_ps]).to be_a Float
      expect(sca_schools.first[:pct_is]).to be_a Float
      expect(sca_schools.first[:pct_hs]).to be_a Float
      expect(sca_schools.first[:total_est_cost]).to be_a Float
      expect(sca_schools.first[:funding_current_budget]).to be_a Float
      expect(sca_schools.first[:funding_previous]).to be_a Float
      expect(sca_schools.first[:pct_funded]).to be_a Float

      expect(sca_schools.first[:start_date]).is_a? (ActiveSupport::TimeWithZone)
      expect(sca_schools.first[:planned_end_date]).is_a? (ActiveSupport::TimeWithZone)

      expect(sca_schools.first[:guessed_pct].class).to be_in([TrueClass, FalseClass, NilClass])

      # with Sequel, geometry is formatted as WKB
      geometry_wkb = sca_schools.first[:geom]
      expect(geometry_wkb).to be_a String

      # geometry parsed
      geometry_parsed = RGeo::WKRep::WKBParser.new(nil, support_ewkb: true).parse(geometry_wkb)
      expect(geometry_parsed.geometry_type).to be RGeo::Feature::Point
      expect(geometry_parsed.srid).to eq(4326)

      expect(sca_schools.first[:project_dsf]).to eq('DSF0000424314')
    end

    it "returns an array of SCA schools that match subdistrict VERSION 2017" do
      subdistrict_pairs = ["(2,3)"]

      subdistricts = school_subdistrict.for_subdistrict_pairs(subdistrict_pairs)

      geometry = subdistricts.map {|x| x[:geom]}

      sca_schools = sca_capital_project_022019.sca_projects_intersecting_subdistrict_geom(geometry.first)

      expect(sca_schools.first[:project_dsf]).to be_a String
      expect(sca_schools.first[:name]).to be_a String
      expect(sca_schools.first[:org_level]).to be_a String

      expect(sca_schools.first[:capacity]).to be_an Integer
      expect(sca_schools.first[:pct_ps]).to be_a Float
      expect(sca_schools.first[:pct_is]).to be_a Float
      # expect(sca_schools.first[:pct_hs]).to be_a Float
      expect(sca_schools.first[:total_est_cost]).to be_a Float
      expect(sca_schools.first[:funding_current_budget]).to be_a Float # this attribute should not
      expect(sca_schools.first[:funding_previous]).to be_a Float
      expect(sca_schools.first[:pct_funded]).to be_a Float

      expect(sca_schools.first[:start_date]).is_a? (ActiveSupport::TimeWithZone)
      expect(sca_schools.first[:planned_end_date]).is_a? (ActiveSupport::TimeWithZone)

      expect(sca_schools.first[:guessed_pct].class).to be_in([TrueClass, FalseClass, NilClass])

      # with Sequel, geometry is formatted as WKB
      geometry_wkb = sca_schools.first[:geom]
      expect(geometry_wkb).to be_a String

      # geometry parsed
      geometry_parsed = RGeo::WKRep::WKBParser.new(nil, support_ewkb: true).parse(geometry_wkb)
      expect(geometry_parsed.geometry_type).to be RGeo::Feature::Point
      expect(geometry_parsed.srid).to eq(4326)

      expect(sca_schools.first[:project_dsf]).to eq('DSF0000865846')
    end
  end
end
