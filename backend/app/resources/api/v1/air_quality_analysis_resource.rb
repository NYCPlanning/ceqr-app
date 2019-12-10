module Api
  module V1
    class AirQualityAnalysisResource < BaseResource
      has_one :project

      attributes(
        :in_area_of_concern
      )
      
    end
  end
end
