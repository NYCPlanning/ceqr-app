import Component from '@ember/component';
import { computed, action, toggleProperty } from '@ember/object';

export default class PublicSchoolsSummaryComponent extends Component {
  tagName = '';
  activeSchoolsLevel = 'ps';

  EC_active = false;
  NA_resdev = false;
  NA_schools = false;
  NA_utilchange = false;
  WA_schools = false;

  @computed(
    'activeSchoolsLevel',
    'analysis.{hsLevelTotals,isLevelTotals,psLevelTotals}',
    function () {
      switch (this.activeSchoolsLevel) {
        case 'ps':
          return this.analysis.psLevelTotals;
        case 'is':
          return this.analysis.isLevelTotals;
        case 'hs':
          return this.analysis.hsLevelTotals;
        default:
          return null;
      }
    }
  )
  levelTotals;

  @computed('activeSchoolsLevel', 'analysis.school_buildings', function () {
    // ceqr_school_buildings dataset is a combination of lcgms and bluebook datasets
    // lcgms dataset represents schools that were opened recently
    const lcgmsSchools = this.analysis.school_buildings.filter(
      (school) => school.source === 'lcgms'
    );
    const activeLevelSchools = lcgmsSchools.filterBy(
      'level',
      this.activeSchoolsLevel
    );

    const enrollment = activeLevelSchools
      .mapBy('enroll')
      .reduce((a, v) => a + parseFloat(v), 0);
    const capacity = activeLevelSchools
      .mapBy('capacity')
      .reduce((a, v) => a + parseFloat(v), 0);

    return { enrollment, capacity, activeLevelSchools };
  })
  EC_newSchoolsOpened;

  @computed('activeSchoolsLevel', 'analysis.futureResidentialDev', function () {
    const developments = this.analysis.futureResidentialDev.map((b) => {
      b.set('enrollment', b.get(`${this.activeSchoolsLevel}_students`));
      return b;
    });

    const enrollment = developments
      .mapBy(`${this.activeSchoolsLevel}_students`)
      .reduce((a, v) => a + parseFloat(v), 0);

    return { enrollment, developments };
  })
  NA_newResidentialDevelopment;

  @computed(
    'activeSchoolsLevel',
    'analysis.scaProjects',
    'levelTotals.scaCapacityIncrease',
    function () {
      const capacity = this.levelTotals.scaCapacityIncrease;

      const schools = this.analysis.scaProjects
        .map((b) => ({
          ...b,
          capacity: b[`${this.activeSchoolsLevel}_capacity`],
        }))
        .filter((b) => b.includeInCapacity && b.capacity > 0);

      return { capacity, schools };
    }
  )
  NA_plannedSchools;

  @computed('activeSchoolsLevel', 'analysis.buildings.[]', function () {
    const schools = this.analysis.buildings
      .map((b) => ({
        ...b,
        capacityDelta: parseFloat(b.capacityFuture) - parseFloat(b.capacity),
      }))
      .filter(
        (b) =>
          'capacityFuture' in b &&
          parseFloat(b.capacity) !== parseFloat(b.capacityFuture) &&
          b.level === this.activeSchoolsLevel
      );

    const capacityDelta = schools.reduce((a, b) => a + b.capacityDelta, 0);

    return { capacityDelta, schools };
  })
  NA_significantUtilChanges;

  @computed('activeSchoolsLevel', 'analysis.schoolsWithAction.[]', function () {
    const schools = this.analysis.schoolsWithAction.map((b) => ({
      ...b,
      capacity: parseFloat(b[`${this.activeSchoolsLevel}_seats`]),
    }));

    const capacity = schools
      .mapBy('capacity')
      .reduce((a, v) => a + parseFloat(v), 0);

    return { capacity, schools };
  })
  WA_newSchools;

  @action
  toggle(prop) {
    toggleProperty(this, prop);
  }
}
