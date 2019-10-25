class AdjustTransportationPlanningFactors < ActiveRecord::Migration[5.2]
  def change
    # Modes for Analysis should be analysis-wide
    remove_column :transportation_planning_factors, :modes_for_analysis
    add_column    :transportation_analyses, :modes_for_analysis, :text, default: [], null: false, array: true

    # Rename columns to be clearer
    rename_column :transportation_planning_factors, :mode_splits_from_user, :manual_mode_splits
    rename_column :transportation_planning_factors, :mode_splits, :mode_splits_from_user
    rename_column :transportation_planning_factors, :vehicle_occupancy, :vehicle_occupancy_from_user
  end
end
