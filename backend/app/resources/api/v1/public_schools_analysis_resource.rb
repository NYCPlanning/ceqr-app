class Api::V1::PublicSchoolsAnalysisResource < JSONAPI::Resource
  attributes(
    :multipliers,
    :data_tables,

    :es_school_choice,
    :is_school_choice,

    :subdistricts_from_db,
    :subdistricts_from_user,

    :residential_developments,
    :schools_with_action,

    :hs_projections,
    :hs_students_from_housing,

    :future_enrollment_projections,
    :future_enrollment_multipliers,
    :future_enrollment_new_housing,

    :bluebook,
    :lcgms,
    :sca_projects,

    :doe_util_changes
  )

  has_one :project
end
