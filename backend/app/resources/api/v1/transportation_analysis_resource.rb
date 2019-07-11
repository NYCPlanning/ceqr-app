class Api::V1::TransportationAnalysisResource < JSONAPI::Resource
  attributes(
    :traffic_zone,
    :jtw_study_selection,
    :required_jtw_study_selection,
    :jtw_study_area_centroid,
    :in_out_dists,
    :taxi_vehicle_occupancy
  )

  has_one :project

end
