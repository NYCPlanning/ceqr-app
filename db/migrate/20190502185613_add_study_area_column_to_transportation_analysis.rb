class AddStudyAreaColumnToTransportationAnalysis < ActiveRecord::Migration[5.2]
  def change
    add_column :transportation_analyses, :jtw_study_area_centroid, :geometry, limit: {:srid=>4326, :type=>"point"}, null: false
  end
end
