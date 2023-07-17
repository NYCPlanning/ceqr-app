import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  tablehover: service(),
  tagName: 'tr',
  classNameBindings: ['hover'],
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

  setHover({ source, id }) {
    if (id === this.id && source === this.source) this.set('hover', true);
  },

  removeHover() {
    this.set('hover', false);
  },

  mouseEnter() {
    this.tablehover.trigger('hover', {
      source: this.source,
      id: this.id,
    });
  },

  mouseLeave() {
    this.tablehover.trigger('unhover', {
      source: this.source,
      id: this.id,
    });
  },
});
