class Db::SchoolSubdistrict < DataRecord
  self.table_name = DataPackage.latest_for(:public_schools).table_name_for(:school_subdistricts)

  def self.intersecting_with(geom)
    select(
      "DISTINCT geom, district, subdistrict"
    ).where(
      "ST_Intersects(ST_GeomFromText('#{geom.as_text}', #{geom.srid}), geom)"
    )
  end
end