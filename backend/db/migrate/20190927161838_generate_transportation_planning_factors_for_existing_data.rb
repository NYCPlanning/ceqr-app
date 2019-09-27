class GenerateTransportationPlanningFactorsForExistingData < ActiveRecord::Migration[5.2]
  def change
    TransportationAnalysis.all.each &:compute_for_changed_land_use!
  end
end
