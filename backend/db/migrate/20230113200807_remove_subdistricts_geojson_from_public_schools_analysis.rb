class RemoveSubdistrictsGeojsonFromPublicSchoolsAnalysis < ActiveRecord::Migration[5.2]
  def change
    remove_reference :public_schools_analyses, :subdistricts_geojson, foreign_key: true
  end
end
