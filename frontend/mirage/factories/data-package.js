import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  name: 'November 2017',
  package: 'public_schools',
  version: 'november_2017',
  release_date: Date.now,
  schemas: () => {
    return {
      "doe_school_subdistricts": { table: "2017" },
      "doe_lcgms": {
        table: "2017",
        version: "2018-09-10",
        minYear: 2017,
        maxYear: 2018,
      },
      "sca_bluebook": {
        table: "2017",
        minYear: 2016,
        maxYear: 2017,
      },
      "doe_school_zones_ps": { table: "2018" },
      "doe_school_zones_is": { table: "2018" },
      "doe_school_zones_hs": { table: "2018" },
      "sca_enrollment_pct_by_sd": { table: "2017" },
      "sca_housing_pipeline_by_boro": {
        minYear: 2016,
        maxYear: 2025,
        table: "2017",
      },
      "sca_housing_pipeline_by_sd": {
        minYear: 2016,
        maxYear: 2025,
        table: "2017",
      },
      "sca_enrollment_projections_by_boro": {
        minYear: 2015,
        maxYear: 2025,
        table: "2017",
      },
      "sca_enrollment_projections_by_sd": {
        minYear: 2015,
        maxYear: 2025,
        table: "2017",
      },
      "doe_significant_utilization_changes": {
        table: "062018",
        version: "2018-02-01",
      },
      "sca_capital_projects": {
        table: "2018",
        version: "2018-12-04",
      }
    };
  }
});
