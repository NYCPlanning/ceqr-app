class AddSolidWasteAnalyses < ActiveRecord::Migration[5.2]
  def change
    create_table :solid_waste_analyses do |t|
      t.timestamps
    end

    add_column :solid_waste_analyses, :project_id, :integer
    add_foreign_key :solid_waste_analyses, :projects
  end
end
