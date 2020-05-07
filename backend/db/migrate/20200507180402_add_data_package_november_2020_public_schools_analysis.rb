class AddDataPackageNovember2020PublicSchoolsAnalysis < ActiveRecord::Migration[5.2]
  def up
    DataPackage.create({
      name: "November 2020",
      version: "november_2020",
      package: "public_schools",
      release_date: Date.parse('2020-01-01'),
      schemas: {
        doe_school_zones_hs: {
          table: "2019"
        },
        doe_school_zones_is: {
          table: "2019"
        },
        doe_school_zones_ps: {
          table: "2019"
        },
        ceqr_school_buildings: {
          table: 2019,
          sources: [
            {
              name: "lcgms",
              maxYear: 2019,
              minYear: 2018,
              version: "2019-12-19"
            },
            {
              name: "bluebook",
              maxYear: 2018,
              minYear: 2017
            }
          ]
        },
        sca_capacity_projects: {
          table: "022020",
          version: "2020-02-01"
        },
        doe_school_subdistricts: {
          table: "2017"
        },
        sca_e_projections_by_sd: {
          table: "2019",
          maxYear: 2028,
          minYear: 2018
        },
        sca_e_projections_by_boro: {
          table: "2019",
          maxYear: 2028,
          minYear: 2018
        },
        sca_housing_pipeline_by_sd: {
          table: "2019",
          maxYear: 2027,
          minYear: 2018
        },
        sca_housing_pipeline_by_boro: {
          table: "2019",
          maxYear: 2027,
          minYear: 2018
        },
        doe_significant_utilization_changes: {
          table: "072019",
          version: "2019-07-01"
        }
      }
    })
  end

  def down
    DataPackage.find_by(name: "November 2020").destroy!
  end
end
