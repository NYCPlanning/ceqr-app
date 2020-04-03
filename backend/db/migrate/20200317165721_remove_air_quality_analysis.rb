class RemoveAirQualityAnalysis < ActiveRecord::Migration[5.2]
  def change
    drop_table :air_quality_analyses
  end
end
