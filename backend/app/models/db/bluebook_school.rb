class Db::BluebookSchool < DataRecord
  self.table_name = DataPackage.latest_for(:public_schools).table_name_for(:bluebook)

# all high schools (HS, ISHS) within project borough
  def self.high_schools_in_boro(borocode)
    where(borocode: borocode).where("org_level ILIKE '%HS%'")
  end

# all primary schools (PS, PSIS) within project district and subdistrict
  def self.ps_in_subdistricts(pairs)
    where("(district, subdistrict) IN (VALUES #{pairs.join(',')})").where("org_level ILIKE '%PS%'")
  end

# all intermediate schools (IS, PSIS, ISHS) within project district and subdistrict
  def self.is_in_subdistricts(pairs)
    where("(district, subdistrict) IN (VALUES #{pairs.join(',')})").where("org_level ILIKE '%IS%'")
  end

end
