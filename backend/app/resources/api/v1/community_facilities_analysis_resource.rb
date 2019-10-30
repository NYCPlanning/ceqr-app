module Api
  module V1
    class CommunityFacilitiesAnalysisResource < BaseResource
      has_one :project
    end
  end
end
