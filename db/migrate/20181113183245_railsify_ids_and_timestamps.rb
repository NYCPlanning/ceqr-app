class RailsifyIdsAndTimestamps < ActiveRecord::Migration[5.2]
  def change
    reversible do |dir|
      dir.up do
        execute <<-SQL
          ALTER TABLE projects DROP CONSTRAINT project_pkey;
          ALTER TABLE projects ALTER COLUMN created_at TYPE TIMESTAMP without time zone USING to_timestamp(created_at);
          ALTER TABLE projects ALTER COLUMN updated_at TYPE TIMESTAMP without time zone USING to_timestamp(updated_at);
        
          ALTER TABLE users DROP CONSTRAINT user_pkey;
          ALTER TABLE users ALTER COLUMN created_at TYPE TIMESTAMP without time zone USING to_timestamp(created_at);
          ALTER TABLE users ALTER COLUMN updated_at TYPE TIMESTAMP without time zone USING to_timestamp(updated_at);
        SQL
        
        change_column_null :projects, :created_at, false
        change_column_null :projects, :updated_at, false
        
        change_column_null :users, :created_at, false
        change_column_null :users, :updated_at, false
      end

      # TODO: DB revert not functioning, ideally do not need
  
      # dir.down do
      #   change_column :projects, :created_at, :decimal
      #   change_column :projects, :updated_at, :decimal
      #   change_column_null :projects, :created_at, true
      #   change_column_null :projects, :updated_at, true
        
      #   change_column :users, :created_at, :decimal
      #   change_column :users, :updated_at, :decimal
      #   change_column_null :users, :created_at, true
      #   change_column_null :users, :updated_at, true
      # end
    end

    rename_column :projects, :id, :fortune_id
    rename_column :users, :id, :fortune_id

    change_column_null :projects, :fortune_id, true
    change_column_null :users, :fortune_id, true

    add_column :projects, :id, :primary_key
    add_column :users, :id, :primary_key    
  end
end
