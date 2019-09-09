class Api::V1::TransportationAnalysisResource < JSONAPI::Resource
  attributes(
    :traffic_zone,
    :jtw_study_selection,
    :required_jtw_study_selection,
    :jtw_study_area_centroid,
    :in_out_dists,
    :taxi_vehicle_occupancy,
    :acs_modal_splits,
    :ctpp_modal_splits
  )

  has_one :project

end
