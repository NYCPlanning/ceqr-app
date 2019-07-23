class PrepareTransportationAnalysisForExistingProjects < ActiveRecord::Migration[5.2]
  def change
    TransportationAnalysis.all.each &:compute_for_updated_bbls!
  end
end
