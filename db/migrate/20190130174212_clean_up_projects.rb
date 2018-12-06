class CleanUpProjects < ActiveRecord::Migration[5.2]
  def change
    remove_column :projects, :traffic_zone

    change_column :projects, :build_year, :integer
    change_column :projects, :senior_units, :integer
    change_column :projects, :total_units, :integer
  end
end
