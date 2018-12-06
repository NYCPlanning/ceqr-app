class CreateInitialSolidWasteAndCommunityFacilities < ActiveRecord::Migration[5.2]
  def change
    Project.all.each do |p|
      CommunityFacilitiesAnalysis.find_or_create_by(project: p)
      SolidWasteAnalysis.find_or_create_by(project: p)
    end
  end
end
