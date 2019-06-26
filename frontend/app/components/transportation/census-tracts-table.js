import Component from '@ember/component';
import { inject as service } from '@ember-decorators/service';
import { computed } from '@ember-decorators/object';

/**
 * CensusTractsTable component renders modal-split data for a project's study selection census tracts
 * in a table. The table updates as cenesus tracts are added to/removed from the study selection.
 */
export default class TransportationCensusTractsTableComponent extends Component {
  @service store;
  @service('readonly-ceqr-data-store') readonlyStore;

  /**
   * The transportation-analysis Model, passed down from the project/show/transportation-analysis controller
   */
  analysis = {};

  /**
   * Composite array containing geoids of all selected census tracts
   */
  @computed('analysis.{requiredJtwStudySelection.[],jtwStudySelection.[]}')
  get selectedCensusTractIds() {
    return [...this.get('analysis.jtwStudySelection'), ...this.get('analysis.requiredJtwStudySelection')];
  }

  /**
   * Promise that resolves to an array of modal-split objects for the selected census-tracts
   */
  @computed('analysis.{requiredJtwStudySelection.[],jtwStudySelection.[]}')
  get selectedCensusTractData() {
    const readonlyStore = this.get('readonlyStore');
    const selectedIds = this.get('selectedCensusTractIds');
    return readonlyStore.findByIds('modal-split', selectedIds);
  }
}
