import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tables: computed('project.subdistricts', function() {
    return this.get('project.subdistricts').map((sd) => {
      return {
        ...sd,
        netUnits: this.get('project.netUnits'),
        estEsStudents: this.get('project.estEsStudents') || 0,
        estIsStudents: this.get('project.estIsStudents') || 0,
        estHsStudents: this.get('project.estHsStudents') || 0
      }
    });
  })
});
