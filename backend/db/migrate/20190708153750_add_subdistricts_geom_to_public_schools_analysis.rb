class AddSubdistrictsGeomToPublicSchoolsAnalysis < ActiveRecord::Migration[5.2]
  def change
    add_column :public_schools_analyses, :subdistricts_geom, :geometry, limit: {:srid=>4326, :type=>"multi_polygon"}
  end
end
