import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { isEqual } from 'lodash';

export default Component.extend({
  tablehover: service(),
  /* eslint-disable-next-line ember/require-tagless-components */
  tagName: 'td',
  classNameBindings: ['hover'],
  attributeBindings: ['rowspan'],
  hover: false,

  init() {
    this._super(...arguments);
    this.tablehover.on('hover', this, 'setHover');
    this.tablehover.on('unhover', this, 'removeHover');
  },

  willDestroyElement() {
    this._super(...arguments);
    this.tablehover.off('hover', this, 'setHover');
    this.tablehover.off('unhover', this, 'removeHover');
  },

  setHover(payload) {
    if (isEqual(payload, this.payload)) this.set('hover', true);
  },

  removeHover(payload) {
    if (isEqual(payload, this.payload)) this.set('hover', false);
  },

  mouseEnter() {
    this.tablehover.trigger('hover', this.payload);
  },

  mouseLeave() {
    this.tablehover.trigger('unhover', this.payload);
  },
});
