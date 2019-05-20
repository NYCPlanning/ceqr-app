class CreateDataPackages < ActiveRecord::Migration[5.2]
  def change
    create_table :data_packages do |t|
      t.text :name
      t.text :analysis
      t.date :release_date
      t.jsonb :config
      t.jsonb :datasets

      t.timestamps
    end

    add_reference :public_schools_analyses, :data_package, foreign_key: true

    DataPackage.create({
      name: "November 2017",
      analysis: "public_schools",
      release_date: Date.parse('2017-11-01'),
      datasets: {
        "school_subdistricts": { table: "doe_school_subdistricts.2017" },
        "lcgms": {
          table: "doe_lcgms.2017",
          version: "2018-09-10",
          minYear: 2017,
          maxYear: 2018
        },
        "bluebook": {
          table: "sca_bluebook.2017",
          minYear: 2016,
          maxYear: 2017
        },
        "ps_school_zones": { table: "school_zones.ps_2018" },
        "is_school_zones": { table: "school_zones.is_2018" },
        "hs_school_zones": { table: "school_zones.hs_2018" },
        "enrollment_pct_by_sd": { table: "sca_enrollment_pct_by_sd.2017" },
        "housing_pipeline_by_boro": {
          minYear: 2016,
          maxYear: 2025,
          table: "sca_housing_pipeline.boro_2017"
        },
        "housing_pipeline_by_sd": {
          minYear: 2016,
          maxYear: 2025,
          table: "sca_housing_pipeline.sd_2017"
        },
        "enrollment_projection_by_boro": {
          minYear: 2015,
          maxYear: 2025,
          table: "sca_enrollment_projections.boro_2017"
        },
        "enrollment_projection_by_sd": {
          minYear: 2015,
          maxYear: 2025,
          table: "sca_enrollment_projections.sd_2017"
        },
        "significant_utilization_changes": {
          table: "doe_significant_utilization_changes.062018",
          version: "2018-02-01"
        },
        "capital_projects": {
          table: "sca_capital_projects.2018",
          version: "2018-12-04"
        }
      },
      config: {
        multipliers: {
          "version": "march-2014",
          "thresholdPsIsStudents": 50,
          "thresholdHsStudents": 150,
          "boroughs": [
            {"name": "Manhattan", "ps": 0.12, "is": 0.04, "hs": 0.06, "psisThreshold": 310, "hsThreshold": 2492},
            {"name": "Bronx", "ps": 0.39, "is": 0.16, "hs": 0.19, "psisThreshold": 90, "hsThreshold": 787},
            {"name": "Brooklyn", "ps": 0.29, "is": 0.12, "hs": 0.14, "psisThreshold": 121, "hsThreshold": 1068},
            {"name": "Queens", "ps": 0.28, "is": 0.12, "hs": 0.14, "psisThreshold": 124, "hsThreshold": 1068},
            {"name": "Staten Island", "ps": 0.21, "is": 0.09, "hs": 0.14, "psisThreshold": 165, "hsThreshold": 1068} 
          ]
        },
      }
    })

    DataPackage.create({
      name: "November 2018",
      analysis: "public_schools",
      release_date: Date.parse('2018-11-01'),
      datasets: {
        "school_subdistricts": { table: "doe_school_subdistricts.2017" },
        "lcgms": {
          table: "doe_lcgms.2018",
          version: "2018-12-19",
          minYear: 2018,
          maxYear: 2019
        },
        "bluebook": {
          table: "sca_bluebook.2018",
          minYear: 2017,
          maxYear: 2018
        },
        "ps_school_zones": { table: "school_zones.ps_2018" },
        "is_school_zones": { table: "school_zones.is_2018" },
        "hs_school_zones": { table: "school_zones.hs_2018" },
        "enrollment_pct_by_sd": { table: "sca_enrollment_pct_by_sd.2018" },
        "housing_pipeline_by_boro": {
          minYear: 2018,
          maxYear: 2027,
          table: "sca_housing_pipeline.boro_2018"
        },
        "housing_pipeline_by_sd": {
          minYear: 2018,
          maxYear: 2027,
          table: "sca_housing_pipeline.sd_2018"
        },
        "enrollment_projection_by_boro": {
          minYear: 2017,
          maxYear: 2027,
          table: "sca_enrollment_projections.boro_2018"
        },
        "enrollment_projection_by_sd": {
          minYear: 2017,
          maxYear: 2027,
          table: "sca_enrollment_projections.sd_2018"
        },
        "significant_utilization_changes": {
          table: "doe_significant_utilization_changes.062018",
          version: "2018-02-01"
        },
        "capital_projects": {
          table: "sca_capital_projects.2018",
          version: "2018-12-04"
        }
      },
      config: {
        multipliers: {
          "version": "november-2018",
          "thresholdPsIsStudents": 50,
          "thresholdHsStudents": 150,
          "districts": [
            {
              "csd": 1,
              "ps": 0.05,
              "is": 0.03,
              "hs": 0.02,
              "psisThreshold": 630,
              "hsThreshold": 7126,
              "borocode": "mn"
            },
            {
              "csd": 2,
              "ps": 0.05,
              "is": 0.02,
              "hs": 0.02,
              "psisThreshold": 725,
              "hsThreshold": 7126,
              "borocode": "mn"
            },
            {
              "csd": 3,
              "ps": 0.06,
              "is": 0.03,
              "hs": 0.02,
              "psisThreshold": 569,
              "hsThreshold": 7126,
              "borocode": "mn"
            },
            {
              "csd": 4,
              "ps": 0.13,
              "is": 0.05,
              "hs": 0.02,
              "psisThreshold": 292,
              "hsThreshold": 7126,
              "borocode": "mn"
            },
            {
              "csd": 5,
              "ps": 0.16,
              "is": 0.06,
              "hs": 0.02,
              "psisThreshold": 225,
              "hsThreshold": 7126,
              "borocode": "mn"
            },
            {
              "csd": 6,
              "ps": 0.15,
              "is": 0.06,
              "hs": 0.02,
              "psisThreshold": 242,
              "hsThreshold": 7126,
              "borocode": "mn"
            },
            {
              "csd": 7,
              "ps": 0.37,
              "is": 0.19,
              "hs": 0.15,
              "psisThreshold": 90,
              "hsThreshold": 980,
              "borocode": "bx"
            },
            {
              "csd": 8,
              "ps": 0.31,
              "is": 0.15,
              "hs": 0.15,
              "psisThreshold": 109,
              "hsThreshold": 980,
              "borocode": "bx"
            },
            {
              "csd": 9,
              "ps": 0.34,
              "is": 0.11,
              "hs": 0.15,
              "psisThreshold": 109,
              "hsThreshold": 980,
              "borocode": "bx"
            },
            {
              "csd": 10,
              "ps": 0.33,
              "is": 0.12,
              "hs": 0.15,
              "psisThreshold": 111,
              "hsThreshold": 980,
              "borocode": "bx"
            },
            {
              "csd": 11,
              "ps": 0.26,
              "is": 0.11,
              "hs": 0.15,
              "psisThreshold": 134,
              "hsThreshold": 980,
              "borocode": "bx"
            },
            {
              "csd": 12,
              "ps": 0.33,
              "is": 0.13,
              "hs": 0.15,
              "psisThreshold": 107,
              "hsThreshold": 980,
              "borocode": "bx"
            },
            {
              "csd": 13,
              "ps": 0.07,
              "is": 0.03,
              "hs": 0.09,
              "psisThreshold": 480,
              "hsThreshold": 1767,
              "borocode": "bk"
            },
            {
              "csd": 14,
              "ps": 0.07,
              "is": 0.02,
              "hs": 0.09,
              "psisThreshold": 586,
              "hsThreshold": 1767,
              "borocode": "bk"
            },
            {
              "csd": 15,
              "ps": 0.18,
              "is": 0.05,
              "hs": 0.09,
              "psisThreshold": 220,
              "hsThreshold": 1767,
              "borocode": "bk"
            },
            {
              "csd": 16,
              "ps": 0.13,
              "is": 0.08,
              "hs": 0.09,
              "psisThreshold": 246,
              "hsThreshold": 1767,
              "borocode": "bk"
            },
            {
              "csd": 17,
              "ps": 0.24,
              "is": 0.09,
              "hs": 0.09,
              "psisThreshold": 152,
              "hsThreshold": 1767,
              "borocode": "bk"
            },
            {
              "csd": 18,
              "ps": 0.27,
              "is": 0.16,
              "hs": 0.09,
              "psisThreshold": 118,
              "hsThreshold": 1767,
              "borocode": "bk"
            },
            {
              "csd": 19,
              "ps": 0.38,
              "is": 0.15,
              "hs": 0.09,
              "psisThreshold": 94,
              "hsThreshold": 1767,
              "borocode": "bk"
            },
            {
              "csd": 20,
              "ps": 0.31,
              "is": 0.07,
              "hs": 0.09,
              "psisThreshold": 132,
              "hsThreshold": 1767,
              "borocode": "bk"
            },
            {
              "csd": 21,
              "ps": 0.24,
              "is": 0.07,
              "hs": 0.09,
              "psisThreshold": 161,
              "hsThreshold": 1767,
              "borocode": "bk"
            },
            {
              "csd": 22,
              "ps": 0.27,
              "is": 0.11,
              "hs": 0.09,
              "psisThreshold": 132,
              "hsThreshold": 1767,
              "borocode": "bk"
            },
            {
              "csd": 23,
              "ps": 0.27,
              "is": 0.16,
              "hs": 0.09,
              "psisThreshold": 118,
              "hsThreshold": 1767,
              "borocode": "bk"
            },
            {
              "csd": 32,
              "ps": 0.18,
              "is": 0.04,
              "hs": 0.09,
              "psisThreshold": 235,
              "hsThreshold": 1767,
              "borocode": "bk"
            },
            {
              "csd": 24,
              "ps": 0.23,
              "is": 0.10,
              "hs": 0.13,
              "psisThreshold": 150,
              "hsThreshold": 1172,
              "borocode": "qn"
            },
            {
              "csd": 25,
              "ps": 0.23,
              "is": 0.08,
              "hs": 0.13,
              "psisThreshold": 160,
              "hsThreshold": 1172,
              "borocode": "qn"
            },
            {
              "csd": 26,
              "ps": 0.31,
              "is": 0.14,
              "hs": 0.13,
              "psisThreshold": 111,
              "hsThreshold": 1172,
              "borocode": "qn"
            },
            {
              "csd": 27,
              "ps": 0.31,
              "is": 0.14,
              "hs": 0.13,
              "psisThreshold": 111,
              "hsThreshold": 1172,
              "borocode": "qn"
            },
            {
              "csd": 28,
              "ps": 0.31,
              "is": 0.15,
              "hs": 0.13,
              "psisThreshold": 109,
              "hsThreshold": 1172,
              "borocode": "qn"
            },
            {
              "csd": 29,
              "ps": 0.36,
              "is": 0.16,
              "hs": 0.13,
              "psisThreshold": 96,
              "hsThreshold": 1172,
              "borocode": "qn"
            },
            {
              "csd": 30,
              "ps": 0.16,
              "is": 0.04,
              "hs": 0.13,
              "psisThreshold": 250,
              "hsThreshold": 1172,
              "borocode": "qn"
            },
            {
              "csd": 31,
              "ps": 0.28,
              "is": 0.11,
              "hs": 0.13,
              "psisThreshold": 128,
              "hsThreshold": 1205,
              "borocode": "si"
            }
          ]
        },
      }
    })

    DataPackage.create({
      name: "May 2019",
      analysis: "public_schools",
      release_date: Date.parse('2019-05-01'),
      datasets: {
        "school_subdistricts": { table: "doe_school_subdistricts.2017" },
        "lcgms": {
          table: "doe_lcgms.2018",
          version: "2018-12-19",
          minYear: 2018,
          maxYear: 2019
        },
        "bluebook": {
          table: "sca_bluebook.2018",
          minYear: 2017,
          maxYear: 2018
        },
        "ps_school_zones": { table: "school_zones.ps_2018" },
        "is_school_zones": { table: "school_zones.is_2018" },
        "hs_school_zones": { table: "school_zones.hs_2018" },
        "enrollment_pct_by_sd": { table: "sca_enrollment_pct_by_sd.2018" },
        "housing_pipeline_by_boro": {
          minYear: 2018,
          maxYear: 2027,
          table: "sca_housing_pipeline.boro_2018"
        },
        "housing_pipeline_by_sd": {
          minYear: 2018,
          maxYear: 2027,
          table: "sca_housing_pipeline.sd_2018"
        },
        "enrollment_projection_by_boro": {
          minYear: 2017,
          maxYear: 2027,
          table: "sca_enrollment_projections.boro_2018"
        },
        "enrollment_projection_by_sd": {
          minYear: 2017,
          maxYear: 2027,
          table: "sca_enrollment_projections.sd_2018"
        },
        "significant_utilization_changes": {
          table: "doe_significant_utilization_changes.042019",
          version: "2019-04-01"
        },
        "capital_projects": {
          table: "sca_capital_projects.022019",
          version: "2019-02-01"
        }
      },
      config: {
        multipliers: {
          "version": "november-2018",
          "thresholdPsIsStudents": 50,
          "thresholdHsStudents": 150,
          "districts": [
            {
              "csd": 1,
              "ps": 0.05,
              "is": 0.03,
              "hs": 0.02,
              "psisThreshold": 630,
              "hsThreshold": 7126,
              "borocode": "mn"
            },
            {
              "csd": 2,
              "ps": 0.05,
              "is": 0.02,
              "hs": 0.02,
              "psisThreshold": 725,
              "hsThreshold": 7126,
              "borocode": "mn"
            },
            {
              "csd": 3,
              "ps": 0.06,
              "is": 0.03,
              "hs": 0.02,
              "psisThreshold": 569,
              "hsThreshold": 7126,
              "borocode": "mn"
            },
            {
              "csd": 4,
              "ps": 0.13,
              "is": 0.05,
              "hs": 0.02,
              "psisThreshold": 292,
              "hsThreshold": 7126,
              "borocode": "mn"
            },
            {
              "csd": 5,
              "ps": 0.16,
              "is": 0.06,
              "hs": 0.02,
              "psisThreshold": 225,
              "hsThreshold": 7126,
              "borocode": "mn"
            },
            {
              "csd": 6,
              "ps": 0.15,
              "is": 0.06,
              "hs": 0.02,
              "psisThreshold": 242,
              "hsThreshold": 7126,
              "borocode": "mn"
            },
            {
              "csd": 7,
              "ps": 0.37,
              "is": 0.19,
              "hs": 0.15,
              "psisThreshold": 90,
              "hsThreshold": 980,
              "borocode": "bx"
            },
            {
              "csd": 8,
              "ps": 0.31,
              "is": 0.15,
              "hs": 0.15,
              "psisThreshold": 109,
              "hsThreshold": 980,
              "borocode": "bx"
            },
            {
              "csd": 9,
              "ps": 0.34,
              "is": 0.11,
              "hs": 0.15,
              "psisThreshold": 109,
              "hsThreshold": 980,
              "borocode": "bx"
            },
            {
              "csd": 10,
              "ps": 0.33,
              "is": 0.12,
              "hs": 0.15,
              "psisThreshold": 111,
              "hsThreshold": 980,
              "borocode": "bx"
            },
            {
              "csd": 11,
              "ps": 0.26,
              "is": 0.11,
              "hs": 0.15,
              "psisThreshold": 134,
              "hsThreshold": 980,
              "borocode": "bx"
            },
            {
              "csd": 12,
              "ps": 0.33,
              "is": 0.13,
              "hs": 0.15,
              "psisThreshold": 107,
              "hsThreshold": 980,
              "borocode": "bx"
            },
            {
              "csd": 13,
              "ps": 0.07,
              "is": 0.03,
              "hs": 0.09,
              "psisThreshold": 480,
              "hsThreshold": 1767,
              "borocode": "bk"
            },
            {
              "csd": 14,
              "ps": 0.07,
              "is": 0.02,
              "hs": 0.09,
              "psisThreshold": 586,
              "hsThreshold": 1767,
              "borocode": "bk"
            },
            {
              "csd": 15,
              "ps": 0.18,
              "is": 0.05,
              "hs": 0.09,
              "psisThreshold": 220,
              "hsThreshold": 1767,
              "borocode": "bk"
            },
            {
              "csd": 16,
              "ps": 0.13,
              "is": 0.08,
              "hs": 0.09,
              "psisThreshold": 246,
              "hsThreshold": 1767,
              "borocode": "bk"
            },
            {
              "csd": 17,
              "ps": 0.24,
              "is": 0.09,
              "hs": 0.09,
              "psisThreshold": 152,
              "hsThreshold": 1767,
              "borocode": "bk"
            },
            {
              "csd": 18,
              "ps": 0.27,
              "is": 0.16,
              "hs": 0.09,
              "psisThreshold": 118,
              "hsThreshold": 1767,
              "borocode": "bk"
            },
            {
              "csd": 19,
              "ps": 0.38,
              "is": 0.15,
              "hs": 0.09,
              "psisThreshold": 94,
              "hsThreshold": 1767,
              "borocode": "bk"
            },
            {
              "csd": 20,
              "ps": 0.31,
              "is": 0.07,
              "hs": 0.09,
              "psisThreshold": 132,
              "hsThreshold": 1767,
              "borocode": "bk"
            },
            {
              "csd": 21,
              "ps": 0.24,
              "is": 0.07,
              "hs": 0.09,
              "psisThreshold": 161,
              "hsThreshold": 1767,
              "borocode": "bk"
            },
            {
              "csd": 22,
              "ps": 0.27,
              "is": 0.11,
              "hs": 0.09,
              "psisThreshold": 132,
              "hsThreshold": 1767,
              "borocode": "bk"
            },
            {
              "csd": 23,
              "ps": 0.27,
              "is": 0.16,
              "hs": 0.09,
              "psisThreshold": 118,
              "hsThreshold": 1767,
              "borocode": "bk"
            },
            {
              "csd": 32,
              "ps": 0.18,
              "is": 0.04,
              "hs": 0.09,
              "psisThreshold": 235,
              "hsThreshold": 1767,
              "borocode": "bk"
            },
            {
              "csd": 24,
              "ps": 0.23,
              "is": 0.10,
              "hs": 0.13,
              "psisThreshold": 150,
              "hsThreshold": 1172,
              "borocode": "qn"
            },
            {
              "csd": 25,
              "ps": 0.23,
              "is": 0.08,
              "hs": 0.13,
              "psisThreshold": 160,
              "hsThreshold": 1172,
              "borocode": "qn"
            },
            {
              "csd": 26,
              "ps": 0.31,
              "is": 0.14,
              "hs": 0.13,
              "psisThreshold": 111,
              "hsThreshold": 1172,
              "borocode": "qn"
            },
            {
              "csd": 27,
              "ps": 0.31,
              "is": 0.14,
              "hs": 0.13,
              "psisThreshold": 111,
              "hsThreshold": 1172,
              "borocode": "qn"
            },
            {
              "csd": 28,
              "ps": 0.31,
              "is": 0.15,
              "hs": 0.13,
              "psisThreshold": 109,
              "hsThreshold": 1172,
              "borocode": "qn"
            },
            {
              "csd": 29,
              "ps": 0.36,
              "is": 0.16,
              "hs": 0.13,
              "psisThreshold": 96,
              "hsThreshold": 1172,
              "borocode": "qn"
            },
            {
              "csd": 30,
              "ps": 0.16,
              "is": 0.04,
              "hs": 0.13,
              "psisThreshold": 250,
              "hsThreshold": 1172,
              "borocode": "qn"
            },
            {
              "csd": 31,
              "ps": 0.28,
              "is": 0.11,
              "hs": 0.13,
              "psisThreshold": 128,
              "hsThreshold": 1205,
              "borocode": "si"
            }
          ]
        },
      }
    })

  end
end
