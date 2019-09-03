module CeqrData
  class DoeSignificantUtilizationChanges < Base
    self.schema = "doe_significant_utilization_changes"

    # all DOE Significant Utilization Changes matching list of building IDs from project
    def doe_util_changes_matching_with_building_ids(buildingsBldgIds)      
      query.select(
        :at_scale_year, :at_scale_enroll, :bldg_id, :bldg_id_additional, :org_id, :url, :vote_date, :title
      ).where(
        bldg_id: buildingsBldgIds
      ).or(
        bldg_id_additional: buildingsBldgIds
      ).all
    end 
  end
end
