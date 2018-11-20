class ProjectPermissions < ActiveRecord::Migration[5.2]
  def change
    create_join_table :project, :user, table_name: :project_permissions do |t|
      t.index :project_id
      t.index :user_id

      t.string :permission, null: false

      t.primary_key :id
    end
  end
end
