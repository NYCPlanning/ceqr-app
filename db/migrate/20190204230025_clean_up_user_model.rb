class CleanUpUserModel < ActiveRecord::Migration[5.2]
  def change
    remove_column :users, :fortune_id
    remove_column :users, :projects
    remove_column :users, :projects_viewable
  end
end
