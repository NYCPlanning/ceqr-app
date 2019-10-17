module Api
  module V1
    class TransportationAnalysisResource < BaseResource
      attributes(
        :traffic_zone,
        :census_tracts_selection,
        :required_census_tracts_selection,
        :census_tracts_centroid
      )

      def census_tracts_centroid     
        RGeo::GeoJSON.encode(
          RGeo::GeoJSON::FeatureCollection.new(  
            [RGeo::GeoJSON::Feature.new(@model.census_tracts_centroid)]
          )
        )
      end
    
      has_one :project
      has_many :transportation_planning_factors
    end
  end
end
