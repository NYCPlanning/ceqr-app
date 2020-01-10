import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  mapservice: service(),
  'ceqr-data': service(),
  'project-orchestrator': service(),

  init() {
    this._super(...arguments);
    this.fetchSubdistricts.perform();

    this.districts = [];
    this.allSubdistricts = [];
  },

  fetchSubdistricts: task(function* () {
    const dataPackage = yield this.get('analysis.dataPackage');
    const response = yield this.get('ceqr-data').subdistricts(dataPackage.schemas.doe_school_subdistricts.table);

    const allSubdistricts = response.reject((sd) => {
      const fromUser = this.analysis.subdistrictsFromUser.find((a) => (sd.district === a.district && sd.subdistrict === a.subdistrict));
      const fromDb = this.analysis.subdistrictsFromDb.find((a) => (sd.district === a.district && sd.subdistrict === a.subdistrict));

      return (!!fromUser || !!fromDb);
    });

    this.set('allSubdistricts', allSubdistricts);

    const districts = allSubdistricts.mapBy('district').uniq();
    this.set('districts', districts);
  }),

  subdistricts: computed('district', function() {
    if (!this.district) return [];
    return this.allSubdistricts.filterBy('district', this.district).mapBy('subdistrict');
  }),

  actions: {
    setDistrict(district) {
      this.set('district', parseInt(district));
      this.set('subdistrict', null);
    },

    setSubdistrict(subdistrict) {
      this.set('subdistrict', parseInt(subdistrict));
    },

    addSubdistrict() {
      const subdistricts = this.analysis.subdistrictsFromUser;
      subdistricts.push({
        district: parseInt(this.district),
        subdistrict: parseInt(this.subdistrict),
        id: `${this.district}${this.subdistrict}`,
        sdName: `District ${this.district} - Subdistrict ${this.subdistrict}`,
      });

      this.set('analysis.subdistrictsFromUser', subdistricts);
      this.set('subdistrict', null);

      this.get('project-orchestrator').set('analysis', this.analysis);
      this.get('project-orchestrator.saveAnalysis').perform().then(
        () => this.mapservice.fitToSubdistricts(),
      );
    },

    removeSubdistrict(sd) {
      const subdistricts = this.analysis.subdistrictsFromUser;
      this.set('analysis.subdistrictsFromUser', subdistricts.removeObject(sd));

      this.get('project-orchestrator').set('analysis', this.analysis);
      this.get('project-orchestrator.saveAnalysis').perform().then(
        () => this.mapservice.fitToSubdistricts(),
      );
    },
  },
});
