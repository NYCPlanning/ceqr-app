import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

export default class PublicSchoolsAnalysisThresholdResultsComponent extends Component {
  tagName = '';
  @alias('analysis.multipliers.thresholdPsIsStudents') thresholdPsIsStudents;
  @alias('analysis.multipliers.thresholdHsStudents') thresholdHsStudents;

  @computed('thresholdPsIsStudents', function () {
    return `Greater than ${this.thresholdPsIsStudents} elementary and middle school students triggers a detailed analysis.`;
  })
  esMsEffectPopupText;
  @computed('thresholdHsStudents', function () {
    return `Greater than ${this.thresholdHsStudents} high school students triggers a detailed analysis.`;
  })
  hsEffectPopupText;
}
