require 'rails_helper'

RSpec.describe CeqrData::CtppCensustractVariables, type: :model do
  let(:ctpp_censustract_variables) { CeqrData::CtppCensustractVariables.version(2010) }

  xdescribe "#st_union_geoids_centroid" do
    it "returns a unioned multipolygon representation of the geoids" do
      geom = ctpp_censustract_variables.st_union_geoids_centroid(["36005009300", "36081000100", "36081094202"])

      expect(geom.srid).to eq(4326)
      expect(geom.geometry_type).to be RGeo::Feature::Point
    end
  end
  
  xdescribe "#for_geom" do
    it "returns the geoids for the input geometry" do
      geom = generate(:multi_polygon)

      geoids = ctpp_censustract_variables.for_geom(geom)

      expect(geoids).to eq(["36061000700"])
    end
  end
end