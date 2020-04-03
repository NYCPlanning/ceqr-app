module CeqrData
  class CeqrSchoolBuildings < Base  
    self.schema = "ceqr_school_buildings"

		# all high schools (HS, ISHS) within project borough
		def high_schools_in_boro(borocode)
			@dataset.select(
				:geom, :district, :subdistrict, :borocode, :bldg_name, :excluded, :bldg_id, :org_id, :org_level, :name, 
				:address, :source, :pc, :pe, :ic, :ie, :hc, :he
			).where(borocode: borocode).where(Sequel.ilike(:org_level, '%HS%'))
		end

		# all primary schools (PS, PSIS) within project district and subdistrict
		def primary_schools_in_subdistricts(subdistrict_pairs)
			@dataset.select(
        		:geom, :district, :subdistrict, :borocode, :bldg_name, :excluded, :bldg_id, :org_id, :org_level, :name, 
		    	:address, :source, :pc, :pe, :ic, :ie, :hc, :he
		  	).where(Sequel.lit("(district, subdistrict) IN (VALUES #{subdistrict_pairs.join(',')})")).where(Sequel.ilike(:org_level, '%PS%'))
		end
		
		# all intermediate schools (IS, PSIS, ISHS) within project district and subdistrict
		def intermediate_schools_in_subdistricts(subdistrict_pairs)
			@dataset.select(
				:geom, :district, :subdistrict, :borocode, :bldg_name, :excluded, :bldg_id, :org_id, :org_level, :name, 
				:address, :source, :pc, :pe, :ic, :ie, :hc, :he
			).where(Sequel.lit("(district, subdistrict) IN (VALUES #{subdistrict_pairs.join(',')})")).where(Sequel.ilike(:org_level, '%IS%'))
		end
	end
end