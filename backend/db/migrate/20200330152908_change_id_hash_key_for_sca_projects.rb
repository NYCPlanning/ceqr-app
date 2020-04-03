class ChangeIdHashKeyForScaProjects < ActiveRecord::Migration[5.2]
  def change
  	# rename `project_dsf` key to `uid` on sca_projects column
    PublicSchoolsAnalysis.all.each do |analysis|
	    analysis.sca_projects.each do |sca_project|
	        sca_project["uid"] = sca_project.delete("project_dsf")
		end
		analysis.save
    end
  end
end
