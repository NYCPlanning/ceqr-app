class SeedDataPackage < ActiveRecord::Migration[5.2]
  def change
    Rails.application.load_seed

    PublicSchoolsAnalysis.all.each do |a|
      case a.data_tables["version"]
      when "november-2017"
        a.update_column(:data_package_id, DataPackage.where(package: "public_schools", version: "november_2017").first.id)
      when "november-2018"
        a.update_column(:data_package_id, DataPackage.where(package: "public_schools", version: "november_2018").first.id)
      when "november-2018-q2"
        a.update_column(:data_package_id, DataPackage.where(package: "public_schools", version: "november_2018_q2").first.id)
      end
    end

    DataPackage.where(version: nil).destroy_all
  end
end
