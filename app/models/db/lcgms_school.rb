class Db::LcgmsSchool < DataRecord
  self.table_name = DataPackage.latest_for(:public_schools).table_name_for(:lcgms)
end
