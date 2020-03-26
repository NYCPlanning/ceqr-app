import { Factory, trait } from 'ember-cli-mirage';

export default Factory.extend({
  mapPluto: trait({
    name: 'MapPLUTO 18v1',
    package: 'mappluto',
    version: '18v1',
    releaseDate: 'Thu Feb 28 2019 19:00:00 GMT-0500 (Eastern Standard Time)',
    schemas: {
      mappluto: {
        carto: 'mappluto_18v2',
      },
    },
  }),

  nycAcs: trait({
    name: 'ACS 5-year 2017',
    package: 'nyc_acs',
    version: '2017',
    releaseDate: '2018-01-01',
    schemas: {
      nyc_acs: {
        table: '2017',
      },
      nyc_census_tract_boundaries: {
        table: '2010',
      },
    },
  }),

  publicSchools: trait({
    name: 'November 2017',
    package: 'public_schools',
    version: 'november_2017',
    releaseDate: Date.now,
    schemas: () => ({
      doe_school_subdistricts: { table: '2017' },
      doe_lcgms: {
        table: '2017',
        version: '2018-09-10',
        minYear: 2017,
        maxYear: 2018,
      },
      sca_bluebook: {
        table: '2017',
        minYear: 2016,
        maxYear: 2017,
      },
      doe_school_zones_ps: { table: '2018' },
      doe_school_zones_is: { table: '2018' },
      doe_school_zones_hs: { table: '2018' },
      sca_housing_pipeline_by_boro: {
        minYear: 2016,
        maxYear: 2025,
        table: '2017',
      },
      sca_housing_pipeline_by_sd: {
        minYear: 2016,
        maxYear: 2025,
        table: '2017',
      },
      sca_enrollment_projections_by_boro: {
        minYear: 2015,
        maxYear: 2025,
        table: '2017',
      },
      sca_enrollment_projections_by_sd: {
        minYear: 2015,
        maxYear: 2025,
        table: '2017',
      },
      doe_significant_utilization_changes: {
        table: '062018',
        version: '2018-02-01',
      },
      sca_capacity_projects: {
        table: '2018',
        version: '2018-12-04',
      },
    }),
  }),
});
