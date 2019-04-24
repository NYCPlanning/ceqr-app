class Db::ScaCapitalProject < DataRecord
  self.table_name = DataPackage.latest_for(:public_schools).table_name_for(:capital_projects)
end