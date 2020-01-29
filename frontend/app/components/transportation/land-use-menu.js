import Component from '@ember/component';
import { computed, action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class TransportationLandUseMenuComponent extends Component {
  @service notifications;

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
      // notify the user that the project has been saved
      this.get('notifications').success('Project Saved!');
      // this.get('notifications').success('Project Saved!', {
      //   autoClear: true,
      //   clearDuration: 1500,
      //   cssClasses: 'saved-message',
      // });
    } catch (e) {
      // notify the user with a toast that an error occurred
      this.get('notifications').warning('Something went wrong, can you try again?', {
        cssClasses: 'warning-message',
      });
    }
  }
}
