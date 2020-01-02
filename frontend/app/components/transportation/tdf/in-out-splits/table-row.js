import Component from '@ember/component';
import { action } from '@ember-decorators/object';

export default class TransportationTdfInOutSplitsTableRowComponent extends Component {
  tagName = 'tr';

  @action
  syncIn(value) {
    // set isEditing to true in order to enable the save button
    // isEditing will be set to false once the user has clicked the save button in the land use menu...
    // which will disable the save button
    // model.hasDirtyAttributes does not work on nested objects in a model, so this is required for
    // checking whether the model has been changed BUT not saved to the server
    this.set('model.transportationPlanningFactor.isEditing', true);
    this.set('data.in', 100 - value);
  }

  @action
  syncOut(value) {
    // set isEditing to true in order to enable the save button
    this.set('model.transportationPlanningFactor.isEditing', true);
    this.set('data.out', 100 - value);
  }
}
