class Db::DoeSignificantUtilizationChange < DataRecord
  self.table_name = DataPackage.latest_for(:public_schools).table_name_for(:significant_utilization_changes)
end