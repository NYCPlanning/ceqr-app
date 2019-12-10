class CreateAirQuality < ActiveRecord::Migration[5.2]
  def change
    create_table :air_quality_analyses do |t|
      t.bigint "project_id", null: false
      t.boolean "in_area_of_concern"
      
      t.timestamps
    end

    add_foreign_key :air_quality_analyses, :projects
  end
end
