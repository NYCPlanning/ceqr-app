import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { set } from '@ember/object';

export default class MapboxCurrentMousePositionComponent extends Component {
  tagName = '';
  currentMapMouseEvent = null;

  /**
   * Callback upon mousemove or mouseleave, to help pass mouse location to parent.
   * @function
   * @param { Object.{point: {x: float, y: float}} } Mapbox Point - represents current map x,y of mouse
   */
  handleMousePosition = () => {};

  @action
  handleMouseMove(e) {
    set(this, 'currentMapMouseEvent', e);
    this._passPositionToParent();
  }

  @action
  handleMouseLeave() {
    set(this, 'currentMapMouseEvent', null);
    this._passPositionToParent();
  }

  // for yielding mousePosition in template
  @computed('currentMapMouseEvent')
  get mousePosition() {
    return this._pointOfMouseEvent(this.currentMapMouseEvent);
  }

  _passPositionToParent() {
    if (this.handleMousePosition) {
      const mousePoint = this._pointOfMouseEvent(this.currentMapMouseEvent);
      this.handleMousePosition(mousePoint);
    }
  }

  // if exists, get point from mouse event. Otherwise return null.
  _pointOfMouseEvent(mouseEvent) {
    return mouseEvent ? mouseEvent.point : null;
  }
}
