class RemoveDataTablesAndMultipliersFromPublicSchools < ActiveRecord::Migration[5.2]
  def change
    remove_column :public_schools_analyses, :multipliers
    remove_column :public_schools_analyses, :data_tables
    remove_column :public_schools_analyses, :manual_version
  end
end
