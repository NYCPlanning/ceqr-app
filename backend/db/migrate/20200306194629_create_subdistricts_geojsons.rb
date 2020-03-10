class CreateSubdistrictsGeojsons < ActiveRecord::Migration[5.2]
  def change
    create_table :subdistricts_geojsons do |t|
      t.integer :public_schools_analysis_id

      t.timestamps
    end
  end
end
