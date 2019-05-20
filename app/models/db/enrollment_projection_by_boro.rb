class Db::EnrollmentProjectionByBoro < DataRecord
  self.table_name = DataPackage.latest_for(:public_schools).table_name_for(:enrollment_projection_by_boro)
end
