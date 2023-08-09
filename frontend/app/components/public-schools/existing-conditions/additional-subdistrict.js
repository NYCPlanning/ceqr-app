import { set } from '@ember/object';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { computed, action } from '@ember/object';

export default class PublicSchoolsExistingConditionsAdditionalSubdistrictComponent extends Component {
  tagName = '';
  @service() mapservice;
  @service() ceqrData;
  @service() projectOrchestrator;
  @service() store;

  init(...args) {
    super.init(...args);
    this.fetchSubdistricts.perform();

    this.districts = [];
    set(this, 'allSubdistricts', []);
  }

  @task(function* () {
    const dataPackage = yield this.analysis.dataPackage;
    const response = yield this.ceqrData.subdistricts(
      dataPackage.schemas.doe_school_subdistricts.table
    );

    const allSubdistricts = response.reject((sd) => {
      const fromUser = this.analysis.subdistrictsFromUser.find(
        (a) => sd.district === a.district && sd.subdistrict === a.subdistrict
      );
      const fromDb = this.analysis.subdistrictsFromDb.find(
        (a) => sd.district === a.district && sd.subdistrict === a.subdistrict
      );

      return !!fromUser || !!fromDb;
    });

    set(this, 'allSubdistricts', allSubdistricts);

    const districts = allSubdistricts.mapBy('district').uniq();
    set(this, 'districts', districts);
  })
  fetchSubdistricts;

  @computed('allSubdistricts', 'district', function () {
    if (!this.district) return [];
    return this.allSubdistricts
      .filterBy('district', this.district)
      .mapBy('subdistrict');
  })
  subdistricts;

  @action
  setDistrict(district) {
    console.info("setDistrict", district);
    set(this, 'district', parseFloat(district));
    set(this, 'subdistrict', null);
  }

  @action
  setSubdistrict(subdistrict) {
    set(this, 'subdistrict', parseFloat(subdistrict));
  }

  @action
  addSubdistrict() {
    console.log("add subdistrict");
    const subdistricts = this.analysis.subdistrictsFromUser;
    subdistricts.pushObject({
      district: parseFloat(this.district),
      subdistrict: parseFloat(this.subdistrict),
      id: `${this.district}${this.subdistrict}`,
      sdName: `District ${this.district} - Subdistrict ${this.subdistrict}`,
    });

    set(this, 'analysis.subdistrictsFromUser', subdistricts);
    set(this, 'subdistrict', null);

    this.projectOrchestrator.set('analysis', this.analysis);
    this.projectOrchestrator.saveAnalysis.perform().then(() => {
      this.store
        .findRecord(
          'subdistricts-geojson',
          this.analysis.get('subdistrictsGeojson.id')
        )
        .then(() => {
          this.mapservice.fitToSubdistricts(
            this.analysis.get('subdistrictsGeojson.subdistrictsGeojson')
          );
        });
    });
  }

  @action
  removeSubdistrict(sd) {
    console.info("removeSubdistric", sd);
    const subdistricts = this.analysis.subdistrictsFromUser;
    set(this, 'analysis.subdistrictsFromUser', subdistricts.removeObject(sd));

    this.projectOrchestrator.set('analysis', this.analysis);
    this.projectOrchestrator.saveAnalysis.perform().then(() => {
      this.store
        .findRecord(
          'subdistricts-geojson',
          this.analysis.get('subdistrictsGeojson.id')
        )
        .then(() => {
          this.mapservice.fitToSubdistricts(
            this.analysis.get('subdistrictsGeojson.subdistrictsGeojson')
          );
        });
    });
  }
}
