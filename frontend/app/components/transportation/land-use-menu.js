import Component from '@ember/component';
import { computed } from '@ember-decorators/object';

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
}
