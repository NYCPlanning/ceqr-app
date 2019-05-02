class DropPgmigrationsTable < ActiveRecord::Migration[5.2]
  def change
    drop_table :pgmigrations
  end
end
