class AddDataTablesToPublicSchoolsAnalysis < ActiveRecord::Migration[5.2]
  def change
    add_column :public_schools_analyses, :data_tables, :jsonb, null: false, default: {
      version: 'nov17',
      enrollmentProjectionsMinYear: 2015,
      enrollmentProjectionsMaxYear: 2025,
      sourceDates: {
        bluebook: "2016-17",
        enrollmentProjections: "2016 to 2025",
        housingPipeline: "2016 to 2025",
        lcgms: "September 10, 2018",
        demographicSnapshot: "2013 to 2018"
      },
      cartoTables: {
        esSchoolZones: 'support_school_zones_es',
        msSchoolZones: 'support_school_zones_ms',
        hsSchoolZones: 'support_school_zones_hs',

        bluebook: 'ceqr_bluebook_v2017',
        lcgms: 'ceqr_lcgms_v2017',
        enrollmentPctBySd: 'enrollment_pct_by_sd_v2017',
        housingPipelineSd: 'ceqr_housing_pipeline_sd_v2017',
        housingPipelineBoro: 'ceqr_housing_pipeline_boro_v2017',
        enrollmentProjectionsSd: 'ceqr_enrollment_projections_sd_v2017',
        enrollmentProjectionsBoro: 'ceqr_enrollment_projections_boro_v2017'
      }
    }
  end
end
