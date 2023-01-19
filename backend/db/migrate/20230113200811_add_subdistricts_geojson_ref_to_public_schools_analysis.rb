class AddSubdistrictsGeojsonRefToPublicSchoolsAnalysis < ActiveRecord::Migration[5.2]
  def change
    add_reference :public_schools_analyses, :subdistricts_geojson, foreign_key: { on_delete: :cascade }
  end
end
