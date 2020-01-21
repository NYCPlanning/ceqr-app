import { module, test } from 'qunit';
import {
  visit, fillIn, click, currentURL,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | user rerouted to intro page if there are no projects', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('user rerouted to ceqr intro page on login if there are no projects', async function(assert) {
    this.server.create('user');

    await visit('/');
    await fillIn('[data-test-login-form="email"]', 'user@email.com');
    await fillIn('[data-test-login-form="password"]', 'password');
    await click('[data-test-login-form="login"]');
    // there are no projects, so user is rerouted to intro page
    assert.equal(currentURL(), '/ceqr-intro-page');
    assert.dom('[data-test-new-project="intro page"]').exists();
    await click('[data-test-new-project="intro page"]');
    assert.equal(currentURL(), '/project/new');
  });

  test('user rerouted to projects list page on login if there are projects', async function(assert) {
    this.server.create('user');
    this.server.createList('project', 1);

    await visit('/');
    await fillIn('[data-test-login-form="email"]', 'user@email.com');
    await fillIn('[data-test-login-form="password"]', 'password');
    await click('[data-test-login-form="login"]');
    // there is one project, so user is rerouted to projects list page
    assert.equal(currentURL(), '/user/projects');
    assert.dom('[data-test-new-project]').exists();
    await click('[data-test-new-project]');
    assert.equal(currentURL(), '/project/new');
  });
});
