class AddTemporalModeSplitsToPlanningFactors < ActiveRecord::Migration[5.2]
  def change
    add_column :transportation_planning_factors, :temporal_mode_splits, :boolean, null: false, default: false
  end
end
