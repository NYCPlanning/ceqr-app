class CreateProjectPermissions < ActiveRecord::Migration[5.2]
  def change
    create_table :project_permissions do |t|
      t.integer :user_id
      t.integer :project_id

      t.string :access_level

      t.timestamps
    end
  end
end
