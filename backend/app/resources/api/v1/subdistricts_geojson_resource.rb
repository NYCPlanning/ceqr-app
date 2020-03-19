module Api
  module V1
    class SubdistrictsGeojsonResource < BaseResource
      attributes(
        # computed geojson
        :subdistricts_geojson,
      )

      has_one :public_schools_analysis

      def subdistricts_geojson
        RGeo::GeoJSON.encode(
          RGeo::GeoJSON::FeatureCollection.new(
            @model.public_schools_analysis.subdistricts.map do |sd|
              RGeo::GeoJSON::Feature.new(sd[:geom])
            end
          )
        )
      end
    end
  end
end