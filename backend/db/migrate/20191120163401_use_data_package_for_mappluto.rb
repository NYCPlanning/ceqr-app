class UseDataPackageForMappluto < ActiveRecord::Migration[5.2]
  add_column :projects, :data_package_id, :bigint
  add_foreign_key :projects, :data_packages

  Project.all.each do |p|
    p.update_column(:data_package_id, DataPackage.where(package: "mappluto", version: "18v2").first.id)
  end

  remove_column :projects, :bbls_version
end
