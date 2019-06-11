import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { VARIABLE_MODE_LOOKUP } from 'labs-ceqr/models/transportation-census-estimate';

module('Unit | Model | transportation census estimate', function(hooks) {
  setupTest(hooks);

  test('it returns correct display mode from variable', function(assert) {
    let store = this.owner.lookup('service:store');
    let trans_total = store.createRecord('transportation-census-estimate', { variable: 'trans_total' });
    let trans_auto_total = store.createRecord('transportation-census-estimate', { variable: 'trans_auto_total' });
    let trans_public_total = store.createRecord('transportation-census-estimate', { variable: 'trans_public_total' });

    assert.ok(trans_total.mode, VARIABLE_MODE_LOOKUP['trans_public_total']);
    assert.ok(trans_auto_total.mode, VARIABLE_MODE_LOOKUP['trans_auto_total']);
    assert.ok(trans_public_total.mode, VARIABLE_MODE_LOOKUP['trans_public_total']);
  });
});
