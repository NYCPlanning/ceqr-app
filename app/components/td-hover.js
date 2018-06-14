import Component from '@ember/component';

export default Component.extend({
  tagName: 'td',
  classNameBindings: ['hover:blue'],
  hover: false,

  mouseEnter(e) {
    this.set('hover', true);
  },
});
