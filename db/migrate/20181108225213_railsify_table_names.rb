class RailsifyTableNames < ActiveRecord::Migration[5.2]
  def change
    rename_table :project, :projects
    rename_table :user, :users
  end
end
