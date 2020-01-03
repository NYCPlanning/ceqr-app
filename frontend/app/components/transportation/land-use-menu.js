import Component from '@ember/component';
import { computed, action } from '@ember-decorators/object';
import { inject as service } from '@ember-decorators/service';

export default class TransportationLandUseMenuComponent extends Component {
  @service
  notificationMessages;

  @service
  flashMessages;

  showTotalLink = false;

  showMessage = false;

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
     this.model.transportationPlanningFactors.save();
     this.get('flashMessages').success('Success!');
     this.get('notificationMessages').success('Project Saved!', {
       autoClear: true,
       clearDuration: 1500,
       cssClasses: 'chocolate'
     });
  }
}
