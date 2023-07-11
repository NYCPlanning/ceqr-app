import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  'project-orchestrator': service(),
  yearSelection: null,

  buildYearRange: Array.from({ length: (2040 - 2018) }, (v, k) => k + 2018),

  init() {
    this._super(...arguments);
    console.info('arguments', ...arguments);
    const buildYear = this.get('buildYear');
    console.info('init buildYear', buildYear);
  },

  // noop
  save() { },

  actions: {
    // "save" is a passed in action
    save() {
      this.get('save')(this.get('project'));
    },
    back() {
      history.back();
    },
    changeBuildYear() {
      console.info('changing build year');
      const changeAction = this.get('action');
      console.info('changeAction', changeAction);
      const selectedEl = this.$('select')[0];
      const selectedIndex = selectedEl.selectedIndex;
      const buildYearRange = this.get('buildYearRange');
      const selectedValue = buildYearRange[selectedIndex];
      const project = this.get('project', 'buildYear');
      console.info('buildYear', project);
      console.info('project', this.project.buildYear);
      this.project.buildYear = selectedValue;
      console.info('selectedValue', selectedValue);
    }
  },
});
