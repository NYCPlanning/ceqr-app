import Component from '@ember/component';
import { computed, action } from '@ember-decorators/object';
import { inject as service } from '@ember-decorators/service';

export default class TransportationLandUseMenuComponent extends Component {
  @service
  notificationMessages;

  showTotalLink = false;

  @computed('tdfSection')
  get factorLink() {
    return `project.show.transportation.tdf.${this.tdfSection}.show`;
  }

  @computed('tdfSection')
  get totalLink() {
    return `project.show.transportation.tdf.${this.tdfSection}.total`;
  }

  @computed('model.transportationPlanningFactors.@each.isEditing')
  get isEditing() {
    // checks the isEditing attribute on ALL factors (residential and office)
    const isEditingValues = this.model.transportationPlanningFactors.map(factor => factor.isEditing);
    // if ANY of the factors have isEditing equal to true, then the Save button is enabled
    return isEditingValues.includes(true);
  }

  @action
  saveFactors() {
    try {
       // set isEditing to false in order to disable the save button
       // model.hasDirtyAttributes does not work on nested objects in a model, so this is required for
       // checking whether the model has been changed BUT not saved to the server
      this.model.transportationPlanningFactors.setEach('isEditing', false);
      // save the model changes to the server
      this.model.transportationPlanningFactors.save();
      // notify the user that the project has been saved
      this.get('notificationMessages').success('Project Saved!', {
        autoClear: true,
        clearDuration: 1500,
        cssClasses: 'saved-message'
      });
    } catch (e) {
      // notify the user with a toast that an error occurred
      this.get('notificationMessages').warning('Something went wrong, can you try again?', {
        cssClasses: 'warning-message'
      });
    }
  }
}
