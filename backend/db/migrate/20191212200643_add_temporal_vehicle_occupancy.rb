class AddTemporalVehicleOccupancy < ActiveRecord::Migration[5.2]
  def change
    add_column :transportation_planning_factors, :temporal_vehicle_occupancy, :boolean, null: false, default: false
  end
end
