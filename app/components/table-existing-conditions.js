import Component from '@ember/component';

export default Component.extend({
  activeSchoolsLevel: 'ps',
  activeSdId: null,
  
  didReceiveAttrs() {
    this._super(...arguments);
    const results = this.get('results');
    if (results) this.set('activeSdId', results[0])
  },
});
