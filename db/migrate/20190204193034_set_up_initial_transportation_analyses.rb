class SetUpInitialTransportationAnalyses < ActiveRecord::Migration[5.2]
  def change
    Project.all.each do |p|
      TransportationAnalysis.find_or_create_by(project: p)
    end
  end
end
