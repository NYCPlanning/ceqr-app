import Component from '@ember/component';
import { action } from '@ember-decorators/object';

export default class MapboxCurrentMousePositionComponent extends Component {
  currentMapMouseEvent = null;

  @action
  handleMouseMove(e) {
    this.set('currentMapMouseEvent', e);
  }

  @action
  handleMouseLeave() {
    this.set('currentMapMouseEvent', null);
  }
}
