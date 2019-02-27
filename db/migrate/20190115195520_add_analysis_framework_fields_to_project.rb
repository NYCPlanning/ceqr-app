class AddAnalysisFrameworkFieldsToProject < ActiveRecord::Migration[5.2]
  def change
    add_column :projects, :commercial_land_use, :jsonb, default: [], null: false, array: true
    add_column :projects, :industrial_land_use, :jsonb, default: [], null: false, array: true
    add_column :projects, :community_facility_land_use, :jsonb, default: [], null: false, array: true
    add_column :projects, :parking_land_use, :jsonb, default: [], null: false, array: true
  end
end
