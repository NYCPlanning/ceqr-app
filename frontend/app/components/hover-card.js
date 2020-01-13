import Component from '@ember/component';
import { htmlSafe } from '@ember/string';
import { computed } from '@ember/object';

export default class HoverCardComponent extends Component {
  // option
  // public
  // hash with x and y key/values
  point = {
    x: 0,
    y: 0,
  };

  // returns style attrs to position
  // a dom element
  @computed('point')
  get containerStyleAttributes() {
    const { point } = this;
    const { y: top, x: left } = point;

    return htmlSafe(`
      top: ${top}px; 
      left: ${left}px; 
      pointer-events: none;
    `);
  }
}
