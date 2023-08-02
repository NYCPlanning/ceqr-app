import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { set } from '@ember/object';

export default class TrHoverComponent extends Component {
  @service() tablehover;
  tagName = 'tr';
  classNameBindings = ['hover'];
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

  setHover({ source, id }) {
    if (id === this.id && source === this.source) set(this, 'hover', true);
  }

  removeHover() {
    set(this, 'hover', false);
  }

  mouseEnter() {
    this.tablehover.trigger('hover', {
      source: this.source,
      id: this.id,
    });
  }

  mouseLeave() {
    this.tablehover.trigger('unhover', {
      source: this.source,
      id: this.id,
    });
  }
}
