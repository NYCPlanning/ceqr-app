class Db::HousingPipelineByBoro < DataRecord
  self.table_name = DataPackage.latest_for(:public_schools).table_name_for(:housing_pipeline_by_boro)
end
