import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  tablehover: service(),
  tagName: 'tr',
  classNameBindings: ['hover'],
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

  setHover({ source, id }) {
    if (
      id === this.get('id') &&
      source === this.get('source')
    ) this.set('hover', true);
  },

  removeHover() {
    this.set('hover', false);
  },

  mouseEnter() {
    this.get('tablehover').trigger('hover', {
      source: this.get('source'),
      id: this.get('id'),
    })
  },

  mouseLeave() {
    this.get('tablehover').trigger('unhover', {
      source: this.get('source'),
      id: this.get('id'),
    });
  },
});
