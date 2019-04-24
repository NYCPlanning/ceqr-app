class Db::BluebookSchool < DataRecord
  self.table_name = DataPackage.latest_for(:public_schools).table_name_for(:bluebook)
end
