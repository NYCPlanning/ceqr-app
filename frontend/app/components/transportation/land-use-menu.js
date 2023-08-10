import Component from '@ember/component';
import { computed, action } from '@ember/object';

export default class TransportationLandUseMenuComponent extends Component {
  tagName = '';
  showTotalLink = false;

  @computed('tdfSection')
  get factorLink() {
    return `project.show.transportation.tdf.${this.tdfSection}.show`;
  }

  @computed('tdfSection')
  get totalLink() {
    return `project.show.transportation.tdf.${this.tdfSection}.total`;
  }

  @action
  saveFactors() {
    console.info('saveFactors for land use menu');
    this.model.transportationPlanningFactors.save();
  }
}
