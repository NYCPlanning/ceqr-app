class Db::SchoolSubdistrict < DataRecord
  self.table_name = DataPackage.latest_for(:public_schools).table_name_for(:school_subdistricts)
end