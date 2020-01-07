import Component from '@ember/component';
import { computed, action } from '@ember-decorators/object';

export default class TransportationLandUseMenuComponent extends Component {
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
      try {
        // save the model changes to the server
        this.model.transportationPlanningFactors.save();
      } catch (e) {
        // TODO: notify user that an error has occurred
      }
    }
  }
