class MigrateTransportationAnalysisToDataPackage < ActiveRecord::Migration[5.2]
  def change
    TransportationAnalysis.all.each do |ta|
      ta.nyc_acs_data_package_id = DataPackage.latest_for("nyc_acs").id
      ta.ctpp_data_package_id = DataPackage.latest_for("ctpp").id

      ta.save
    end
  end
end
