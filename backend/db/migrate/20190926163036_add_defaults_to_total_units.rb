class AddDefaultsToTotalUnits < ActiveRecord::Migration[5.2]
  def change
    Project.all.each do |p|
      p.total_units = 0 if p.total_units.nil?
      p.senior_units = 0 if p.senior_units.nil?
      p.save
    end
    
    change_column :projects, :total_units, :integer, default: 0, null: false
    change_column :projects, :senior_units, :integer, default: 0, null: false
  end
end
