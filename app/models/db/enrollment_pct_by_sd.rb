class Db::EnrollmentPctBySd < DataRecord
  self.table_name = DataPackage.latest_for(:public_schools).table_name_for(:enrollment_pct_by_sd)
end
