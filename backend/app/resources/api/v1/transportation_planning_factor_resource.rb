module Api
  module V1
    class TransportationPlanningFactorResource < BaseResource
      model_name 'TransportationPlanningFactors'

      attributes(
        :land_use,
        :manual_mode_splits,
        :temporal_mode_splits,
        :temporal_vehicle_occupancy,
        :mode_splits_from_user,
        :census_tract_variables,
        :vehicle_occupancy_from_user,
        :in_out_splits,
        :truck_in_out_splits,
        :table_notes
      )
    
      has_one :transportation_analysis
      has_one :data_package
    end
  end
end
