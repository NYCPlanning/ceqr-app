class AddTaxiVehicleOccupancyToTransportationAnalysis < ActiveRecord::Migration[5.2]
  def change
    add_column :transportation_analyses, :taxi_vehicle_occupancy, :float, null: true
  end
end
