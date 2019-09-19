class MigrateTransportationAnalysisToDataPackage < ActiveRecord::Migration[5.2]
  def change
    TransportationAnalysis.all.each do |ta|
      ta.nyc_acs_data_package = DataPackage.latest_for("nyc_acs")
      ta.ctpp_data_package = DataPackage.latest_for("ctpp")

      ta.save
    end
  end
end
