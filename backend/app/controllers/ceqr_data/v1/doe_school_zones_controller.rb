module CeqrData
  module V1
    class DoeSchoolZonesController < CeqrDataController
      def geojson
        case params[:level]
        when 'ps'
          zones = DoeSchoolZonesPs.version(params[:version]).query.where(borocode: params[:borocode]).all
        when 'is'
          zones = DoeSchoolZonesIs.version(params[:version]).query.where(borocode: params[:borocode]).all
        when 'hs'
          zones = DoeSchoolZonesHs.version(params[:version]).query.where(borocode: params[:borocode]).all
        end

        geojson = RGeo::GeoJSON.encode(
          RGeo::GeoJSON::FeatureCollection.new(  
            zones.map do |z|
              RGeo::GeoJSON::Feature.new(
                RGeo::WKRep::WKBParser.new(nil, support_ewkb: true).parse(z[:geom]), 
                z[:id], {
                  remarks: z[:remarks],
                  dbn: z[:dbn]
                }
              )
            end
          )
        )

        json_response(geojson)
      end
    end
  end
end
