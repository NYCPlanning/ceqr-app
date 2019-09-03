module CeqrData
  module V1
    class DoeSchoolSubdistrictsController < CeqrDataController
      def subdistricts
        db = CeqrData::DoeSchoolSubdistricts.version(params[:version])
        response = db.query.select(:district, :subdistrict).order(:district, :subdistrict).all
        json_response(response)
      end
    end
  end
end
