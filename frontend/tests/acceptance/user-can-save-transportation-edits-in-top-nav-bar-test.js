import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | user can save transportation edits in top nav bar', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /user-can-save-transportation-edits-in-top-nav-bar', async function(assert) {
    await visit('/user-can-save-transportation-edits-in-top-nav-bar');

    assert.equal(currentURL(), '/user-can-save-transportation-edits-in-top-nav-bar');
  });
});
