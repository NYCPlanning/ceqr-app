import Component from '@ember/component';
import { computed, action, set } from '@ember/object';
import { isEmpty } from '@ember/utils';

export default class PublicSchoolsNoActionSCAComponent extends Component {
  tagName = '';
  didRender() {
    super.didRender(...arguments);
    this.$('.progress').progress();
    this.$('.progress').popup();
  }

  @computed('analysis.{scaProjects,subdistricts.[]}', function () {
    const tables = this.analysis.subdistricts.map((sd) => {
      const buildings = this.analysis.scaProjects.filter(
        (b) => b.district === sd.district && b.subdistrict === sd.subdistrict
      );

      if (isEmpty(buildings)) return null;
      return {
        ...sd,
        buildings,
      };
    });

    return tables.compact();
  })
  tables;

  @action
  save() {
    set(this, 'saving', true);
    this.analysis.save().then(() => set(this, 'saving', false));
  }
}
