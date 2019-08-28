class CleanupUnusedColumns < ActiveRecord::Migration[5.2]
  def change
    remove_column :projects, :borough, :string
    remove_column :public_schools_analyses, :direct_effect, :boolean
  end
end
