class RefactorTransportationAnalysis < ActiveRecord::Migration[5.2]
  def change
    create_table :transportation_planning_factors do |t|
      t.jsonb "mode_splits", default: {}, null: false
      t.boolean "mode_splits_from_user", default: true, null: false
      t.jsonb "census_tract_variables", default: [], null: false, array: true
      t.jsonb "vehicle_occupancy", default: {}, null: false
      t.text "modes_for_analysis", default: [], null: false, array: true
      t.text "land_use", null: false
      t.jsonb "in_out_splits", default: {}, null: false
      t.jsonb "truck_in_out_splits", default: {}, null: false
      t.jsonb "table_notes", default: {}, null: false

      t.bigint "data_package_id"
      t.bigint "transportation_analysis_id"

      t.timestamps
    end

    add_foreign_key :transportation_planning_factors, :data_packages
    add_foreign_key :transportation_planning_factors, :transportation_analyses

    rename_column :transportation_analyses, :jtw_study_area_centroid, :census_tracts_centroid
    rename_column :transportation_analyses, :required_jtw_study_selection, :required_census_tracts_selection
    rename_column :transportation_analyses, :jtw_study_selection, :census_tracts_selection

    remove_column :transportation_analyses, :in_out_dists
    remove_column :transportation_analyses, :taxi_vehicle_occupancy
    remove_column :transportation_analyses, :acs_modal_splits
    remove_column :transportation_analyses, :ctpp_modal_splits
    remove_column :transportation_analyses, :nyc_acs_data_package_id
    remove_column :transportation_analyses, :ctpp_data_package_id
  end
end
