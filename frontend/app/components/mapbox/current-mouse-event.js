import Component from '@ember/component';
import { action } from '@ember/object';
import { set } from '@ember/object';

export default class MapboxCurrentMouseEventComponent extends Component {
  tagName = '';
  currentMapMouseEvent = null;

  @action
  handleEvent(e) {
    console.info('handleMouseEvent', e);
    set(this, 'currentMapMouseEvent', e);
  }
}
