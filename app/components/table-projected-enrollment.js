import Component from '@ember/component';
import { computed } from '@ember/object';
import carto from 'carto-promises-utility/utils/carto';
import { task, waitForProperty } from 'ember-concurrency';
import { isEmpty } from '@ember/utils';

// Need district, subdistrict
// list subdistricts

export default Component.extend({  
  borough: computed.alias('project.borough'),
  subdistrictSqlPairs: computed.alias('project.subdistrictSqlPairs'),

  esNoActionTotals: computed('project.subdistricts.@each', function() {
    return this.get('buildEsNoActionTotals').perform();
  }),


  buildEsNoActionTotals: task(function*() {
    let p = this.get('project').get('subdistricts');

    console.log(this.get('subdistrictSqlPairs'));

    let enrollmentProjections = yield this.get('fetchEnrollmentProjections').perform();
    let enrollmentMultipliers = yield this.get('fetchEnrollmentMultipliers').perform();
    let fetchStudentsFromNewHousing = yield this.get('fetchStudentsFromNewHousing').perform();
  
    console.log(enrollmentProjections);
    console.log(enrollmentMultipliers);
    console.log(fetchStudentsFromNewHousing);

    return p.map((s) => ({
      area: `CSD ${s.district} Subdistrict ${s.subdistrict}`
    }));
  }),

  fetchEnrollmentProjections: task(function*() {    
    const boroughMap = {
      "Bronx": "X",
      "Brooklyn": "K",
      "Manhattan": "M",
      "Queens": "Q",
      "Staten Island": "R",
    }
    
    return yield carto.SQL(`
      SELECT projected_ps_dist, projected_ms_dist
      FROM ceqr_sf_projection_2016_2025
      WHERE school_year LIKE '${this.get('project.buildYear')}%25'
        AND borough = '${boroughMap[this.get('borough')]}'
        AND district = '1'
    `);
  }),
  fetchEnrollmentMultipliers: task(function*() {
    yield waitForProperty(this, 'subdistrictSqlPairs', (s) => !isEmpty(s));
    return yield carto.SQL(`
      SELECT zone_of_dist AS multiplier, disgeo AS district, zone AS subdistrict, level
      FROM ceqr_2019_enrollment_by_zone
      WHERE (disgeo, zone) IN (VALUES ${this.get('project.subdistrictSqlPairs').join(',')})
    `);
  }),
  fetchStudentsFromNewHousing: task(function*() {
    yield waitForProperty(this, 'subdistrictSqlPairs', (s) => !isEmpty(s));
    return yield carto.SQL(`
      SELECT students_from_new_housing AS students
      FROM ceqr_housing_by_sd_2016
      WHERE (dist, zone) IN (VALUES ${this.get('project.subdistrictSqlPairs').join(',')})
    `);
  }),

});
