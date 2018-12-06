class CreateTransportationAnalyses < ActiveRecord::Migration[5.2]
  def change
    create_table :transportation_analyses do |t|
      t.integer :traffic_zone

      t.timestamps
    end

    add_column :transportation_analyses, :project_id, :integer
    add_foreign_key :transportation_analyses, :projects
  end
end
