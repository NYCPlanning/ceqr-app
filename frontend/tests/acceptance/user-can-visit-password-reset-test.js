import { module, test } from 'qunit';
import { visit, find } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | user can visit password reset', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Unauthenticated user can visit password reset page with a token', async function(assert) {
    this.server.create('user');

    await visit('/password-reset?token=a-token');

    assert.ok(find('[data-test-password-reset-form]'));
  });
});
