class AddCommunityFacilitiesAnalysis < ActiveRecord::Migration[5.2]
  def change
    create_table :community_facilities_analyses do |t|
      t.timestamps
    end

    add_column :community_facilities_analyses, :project_id, :integer
    add_foreign_key :community_facilities_analyses, :projects
  end
end
