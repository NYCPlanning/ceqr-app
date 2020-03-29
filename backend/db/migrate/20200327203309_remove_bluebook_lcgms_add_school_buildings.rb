class RemoveBluebookLcgmsAddSchoolBuildings < ActiveRecord::Migration[5.2]
  def change
	# merge jsonb columns
	# to test in the console
	p = ActiveRecord::Base.establish_connection
	c = p.connection

	# the query
	# I think if we don't include a WHERE clause here it'll just do all of them?
	sql = 'UPDATE public_schools_analyses
	SET bluebook = bluebook || 'our_lcgms_column'::jsonb'
	c.execute(sql)

  	# remove lcgms
  	remove_column :public_schools_analyses, :lcgms
  	# rename bluebook to school_buildings
  	# going to do this last
  	rename_column :public_schools_analyses, :bluebook, :school_buildings
  end
end


