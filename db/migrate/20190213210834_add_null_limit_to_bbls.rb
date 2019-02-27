class AddNullLimitToBbls < ActiveRecord::Migration[5.2]
  def change
    change_column_null :projects, :bbls_geom, false
  end
end
