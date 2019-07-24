class RemoveSolidWasteAnalysis < ActiveRecord::Migration[5.2]
  def change
    drop_table :solid_waste_analyses
  end
end
