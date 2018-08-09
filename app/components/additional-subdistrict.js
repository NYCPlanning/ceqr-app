import Component from '@ember/component';
import carto from 'carto-promises-utility/utils/carto';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';

export default Component.extend({
  'schools-capacity': service(),
  
  init() {
    this._super(...arguments);
    this.get('fetchDistricts').perform();
    this.get('schools-capacity').set('project', this.get('project'));
  },

  fetchDistricts: task(function*() {
    const districts = yield carto.SQL(`
      SELECT DISTINCT schooldist AS district
      FROM doe_schoolsubdistricts_v2017
      ORDER BY schooldist`);
    this.set('districts', districts);
  }),

  fetchSubdistricts: task(function*() {
    const subdistricts = yield carto.SQL(`
      SELECT zone AS subdistrict
      FROM doe_schoolsubdistricts_v2017
      WHERE schooldist = ${this.get('district')}
      ORDER BY zone`);
    this.set('subdistricts', subdistricts);
  }),

  addSubdistrict: task(function*() {
    const sd = yield carto.SQL(`
      SELECT cartodb_id, schooldist AS district, zone AS subdistrict
      FROM doe_schoolsubdistricts_v2017
      WHERE schooldist = ${this.get('district')} AND zone = ${this.get('subdistrict')}
    `)

    const subdistricts = this.get('project.subdistrictsFromUser');
    subdistricts.push({
      district: sd[0].district,
      subdistrict: sd[0].subdistrict,
      cartodb_id: sd[0].cartodb_id,
      id: parseInt(`${sd[0].district}${sd[0].subdistrict}`),
      sdName: `District ${sd[0].district} - Subdistrict ${sd[0].subdistrict}`
    });

    this.set('project.subdistrictsFromUser', subdistricts);
    this.get('schools-capacity.addSubdistrict').perform();

    this.set('subdistrict', null);
  }),
  
  actions: {
    setDistrict(district) {
      this.set('district', district);
      this.get('fetchSubdistricts').perform();
    },

    setSubdistrict(subdistrict) {
      this.set('subdistrict', subdistrict);
    },

    addSubdistrict() {
      this.get('addSubdistrict').perform();
    },

    removeSubdistrict(sd) {
      const subdistricts = this.get('project.subdistrictsFromUser');
      this.set('project.subdistrictsFromUser', subdistricts.removeObject(sd));

      this.get('schools-capacity.addSubdistrict').perform();
    },
  }
});
