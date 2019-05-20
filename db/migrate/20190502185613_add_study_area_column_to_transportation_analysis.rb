class AddStudyAreaColumnToTransportationAnalysis < ActiveRecord::Migration[5.2]
  def change
    add_column :transportation_analyses, :jtw_study_area_centroid, :geometry, limit: {:srid=>4326, :type=>"point"}

    TransportationAnalysis.all.each do |a|
      a.send(:compute_study_data)
      a.save!
    end

    change_column_null :transportation_analyses, :jtw_study_area_centroid, false
  end
end
