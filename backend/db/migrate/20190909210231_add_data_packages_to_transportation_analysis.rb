class AddDataPackagesToTransportationAnalysis < ActiveRecord::Migration[5.2]
  def change
    add_column :transportation_analyses, :nyc_acs_data_package_id, :bigint
    add_column :transportation_analyses, :ctpp_data_package_id, :bigint

    add_foreign_key :transportation_analyses, :data_packages, column: :nyc_acs_data_package_id
    add_foreign_key :transportation_analyses, :data_packages, column: :ctpp_data_package_id
  end
end
