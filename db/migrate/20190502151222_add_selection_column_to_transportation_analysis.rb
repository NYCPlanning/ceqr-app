class AddSelectionColumnToTransportationAnalysis < ActiveRecord::Migration[5.2]
  def change
    add_column :transportation_analyses, :jtw_study_selection, :jsonb, default: [], null: false, array: true
  end
end
