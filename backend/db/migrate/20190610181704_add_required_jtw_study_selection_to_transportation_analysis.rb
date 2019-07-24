class AddRequiredJtwStudySelectionToTransportationAnalysis < ActiveRecord::Migration[5.2]
  def change
    add_column :transportation_analyses, :required_jtw_study_selection, :text, array: true, default: []
    TransportationAnalysis.all.each do |a|
      a.send(:compute_required_study_selection)
      a.save!
    end
    change_column_null :transportation_analyses, :required_jtw_study_selection, false

    # also, recreate the jtw_study_selection column as varchar(11)[] type
    remove_column :transportation_analyses, :jtw_study_selection
    add_column :transportation_analyses, :jtw_study_selection, :text, array: true, default: []
  end
end
