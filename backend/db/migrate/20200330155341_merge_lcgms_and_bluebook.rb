class MergeLcgmsAndBluebook < ActiveRecord::Migration[5.2]
  def change
  	# append lcgms objects to bluebook objects in bluebook column
  	PublicSchoolsAnalysis.all.each do |analysis|
        if analysis.lcgms.present?
          analysis.lcgms.each do |lcgms_school|
            analysis.bluebook << lcgms_school
          end
        end
        analysis.save
    end 
    remove_column :public_schools_analyses, :lcgms
    rename_column :public_schools_analyses, :bluebook, :school_buildings
  end
end
