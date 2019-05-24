class AddAffordableUnitsToProject < ActiveRecord::Migration[5.2]
  def change
    add_column :projects, :affordable_units, :integer, default: 0, null: false
  end
end
