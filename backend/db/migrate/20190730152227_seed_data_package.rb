class SeedDataPackage < ActiveRecord::Migration[5.2]
  def change
    Rails.application.load_seed

    PublicSchoolsAnalysis.all.each do |a|
      case a.data_tables["version"]
      when "november-2017"
        a.data_package = DataPackage.where(package: "public_schools", version: "november_2017").first
      when "november-2018"
        a.data_package = DataPackage.where(package: "public_schools", version: "november_2018").first
      when "november-2018-q2"
        a.data_package = DataPackage.where(package: "public_schools", version: "november_2018_q2").first
      end

      a.save!
    end

    DataPackage.where(version: nil).destroy_all
  end
end
