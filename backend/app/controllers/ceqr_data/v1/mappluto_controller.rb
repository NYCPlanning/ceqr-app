module CeqrData
  module V1
    class MapplutoController < CeqrDataController
      def validate
        valid = CeqrData::Mappluto.version(params[:version]).bbl_exists?(params[:bbl])
        json_response(valid: valid)
      end
    end
  end
end