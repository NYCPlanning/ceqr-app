import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { isEqual } from 'lodash';

export default Component.extend({
  tablehover: service(),
  tagName: 'td',
  classNameBindings: ['hover'],
  attributeBindings: ['rowspan'],
  hover: false,
  
  init() {
    this._super(...arguments);
    this.get('tablehover').on('hover', this, 'setHover');
    this.get('tablehover').on('unhover', this, 'removeHover');
  },

  willDestroyElement() {
    this.get('tablehover').off('hover', this, 'setHover');
    this.get('tablehover').off('unhover', this, 'removeHover');
  },

  setHover(payload) {
    if (isEqual(payload, this.get('payload'))) this.set('hover', true);
  },

  removeHover(payload) {
    if (isEqual(payload, this.get('payload'))) this.set('hover', false);
  },

  mouseEnter() {
    this.get('tablehover').trigger('hover', this.get('payload'))
  },

  mouseLeave() {
    this.get('tablehover').trigger('unhover', this.get('payload'))
  },
});
