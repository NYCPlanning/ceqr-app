class RenamePublicSchoolsAnalysisScaProjectsProjectDsf < ActiveRecord::Migration[5.2]
  def change
  	# iterate through each PublicSchoolsAnalysis record
  	PublicSchoolsAnalysis.all.each do |analysis|
  		analysis.sca_projects.each do |sca|
  			# I'm assuming sca here is the current row's value
  			# do we have to do another each here?? To iterate through the objects in the list
  			# EXAMPLE: First get the current column value which Active Record returns as a Ruby hash:
  			currentKeys = sca.project_dsf
  			# EXAMPLE: Convert post params to a hash and extract the nested values which were nested under keys
  			hashedParams = sca_params.to_h[:keys]
  			# EXAMPLE: Use the Ruby hash merge method to merge my post params and current user column data:
  			newKeys = currentKeys.merge(hashedParams)
  			# EXAMPLE: I could now use the Rails object update method as usual:
  			sca.update(project_dsf: uid)
  	 	end
  	end
  end
end
