import Component from '@ember/component';
import { computed, action, set } from '@ember/object';
import mapColors from '../../../utils/mapColors';

export default class PublicSchoolsTableExistingConditionsComponent extends Component {
  tagName = '';
  activeSchoolsLevel = 'ps';
  activeSdId = null;
  mapColors;

  styleFor(level) {
    return mapColors.styleFor(level);
  }

  didReceiveAttrs() {
    super.didReceiveAttrs();
    super.didReceiveAttrs(...arguments);
    const { analysis } = this;

    if (analysis) {
      set(this, 'activeSdId', analysis.subdistricts[0].id);
    }
  }

  // ceqr_school_buildings dataset is a combination of two datasets with different metadata: bluebook dataset and lcgms dataset
  @computed(
    'analysis.dataPackage.schemas.ceqr_school_buildings.sources',
    function () {
      return this.analysis
        .get('dataPackage.schemas')
        .ceqr_school_buildings.sources.find(
          (source) => source.name === 'bluebook'
        );
    }
  )
  bluebookMetadata;

  @computed(
    'activeSchoolsLevel',
    'activeSdId',
    'analysis.subdistrictTotals',
    function () {
      if (this.activeSchoolsLevel === 'hs') {
        return this.analysis.subdistrictTotals.findBy('level', 'hs');
      }
      return this.analysis.subdistrictTotals.find(
        (total) =>
          parseFloat(total.id) === parseFloat(this.activeSdId) &&
          total.level === this.activeSchoolsLevel
      );
    }
  )
  table;

  @computed('table.buildings', function () {
    return this.table.buildings.sortBy('org_id');
  })
  buildings;

  @computed('activeSdId', 'analysis.subdistricts', function () {
    return this.analysis.subdistricts.findBy('id', this.activeSdId);
  })
  sd;

  @action
  setSdId(sdId) {
    set(this, 'activeSdId', sdId);
  }
}
