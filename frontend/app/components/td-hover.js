import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { set } from '@ember/object';
import { isEqual } from 'lodash';

export default class TdHoverComponent extends Component {
  @service() tablehover;
  tagName = 'td';
  classNameBindings = ['hover'];
  attributeBindings = ['rowspan'];
  hover = false;

  constructor() {
    super(...arguments);
    this.tablehover.on('hover', this, 'setHover');
    this.tablehover.on('unhover', this, 'removeHover');
  }

  willDestroyElement() {
    super.willDestroyElement(...arguments);
    super.willDestroyElement(...arguments);
    this.tablehover.off('hover', this, 'setHover');
    this.tablehover.off('unhover', this, 'removeHover');
  }

  setHover(payload) {
    if (isEqual(payload, this.payload)) set(this, 'hover', true);
  }

  removeHover(payload) {
    if (isEqual(payload, this.payload)) set(this, 'hover', false);
  }

  mouseEnter() {
    this.tablehover.trigger('hover', this.payload);
  }

  mouseLeave() {
    this.tablehover.trigger('unhover', this.payload);
  }
}
