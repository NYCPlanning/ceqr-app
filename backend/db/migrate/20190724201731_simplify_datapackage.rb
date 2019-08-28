class SimplifyDatapackage < ActiveRecord::Migration[5.2]
  def change    
    rename_column :data_packages, :analysis, :package
    rename_column :data_packages, :datasets, :schemas
    remove_column :data_packages, :config, :text
    add_column :data_packages, :version, :text

    add_index :data_packages, [:package, :version]
  end
end
