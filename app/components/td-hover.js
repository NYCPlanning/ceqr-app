import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { isEqual } from '@ember/utils';

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

  setHover({ sdid, level, name }) {
    if (
      sdid === this.get('sdid') &&
      level === this.get('level') &&
      name === this.get('name')
    ) this.set('hover', true);
  },

  removeHover({ sdid, level, name }) {
    if (
      sdid === this.get('sdid') &&
      level === this.get('level') &&
      name === this.get('name')
    ) this.set('hover', false);
  },

  mouseEnter() {
    this.get('tablehover').trigger('hover', {
      sdid: this.get('sdid'),
      level: this.get('level'),
      name: this.get('name')
    })
  },

  mouseLeave() {
    this.get('tablehover').trigger('unhover', {
      sdid: this.get('sdid'),
      level: this.get('level'),
      name: this.get('name')
    })
  },
});
