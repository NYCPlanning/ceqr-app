class Api::V1::TransportationAnalysisResource < JSONAPI::Resource
  attribute :traffic_zone

  has_one :project
end
