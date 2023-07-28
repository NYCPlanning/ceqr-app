import Component from '@ember/component';
import { computed, action, set } from '@ember/object';

export default class PublicSchoolsNoActionDOEComponent extends Component {
  tagName = '';
  didReceiveAttrs() {
    super.didReceiveAttrs(...arguments);
    if (this.analysis.doeUtilChangesPerBldg)
      set(this, 'bldg_id', this.analysis.doeUtilChangesPerBldg[0].bldg_id);
  }

  @computed('analysis.doeUtilChangesPerBldg.length', function () {
    return this.analysis.doeUtilChangesPerBldg.length !== 0;
  })
  hasSigUtils;

  @action
  showBldg(bldg_id) {
    set(this, 'bldg_id', bldg_id);
  }
  @action
  save() {
    set(this, 'saving', true);
    this.analysis.save().then(() => set(this, 'saving', false));
  }

  /*
  [
    {
      bldg_id: 'K298',
      buildings: [** all buildings with id],
      doe_notices: [** all notices with id]
    }
  ]
  */
}
