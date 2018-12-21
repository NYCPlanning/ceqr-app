class RenameFutureResidentialDev < ActiveRecord::Migration[5.2]
  def change
    rename_column :public_schools_analyses, :future_residential_dev, :residential_developments
  end
end
