class Api::V1::TransportationPlanningFactorResource < JSONAPI::Resource
  model_name 'TransportationPlanningFactors'
  
  attributes(
    :land_use,
    :mode_splits,
    :mode_splits_from_user,
    :census_tract_variables,
    :vehicle_occupancy,
    :modes_for_analysis,
    :in_out_splits,
    :truck_in_out_splits,
    :table_notes
  )

  has_one :transportation_analysis
  has_one :data_package
end
