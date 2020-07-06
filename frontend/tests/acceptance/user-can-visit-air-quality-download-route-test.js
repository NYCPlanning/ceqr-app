import { module, test } from 'qunit';
import {
  visit, fillIn, click, currentURL,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | user can visit the air quality download route', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('access air quality download route from project', async function(assert) {
    this.server.create('user');

    await visit('/');
    await fillIn('[data-test-login-form="email"]', 'user@email.com');
    await fillIn('[data-test-login-form="password"]', 'password');
    await click('[data-test-login-form="login"]');
    await click('[data-test-new-project="intro page"]');
    await fillIn("[data-test-new-project='project-name']", 'Prospect Acres');
    await click("[data-test-new-project='build-year']");
    await click("[data-test-new-project='2021']", '');
    await fillIn("[data-test-new-project='ceqr-number']", 'esnesenon');

    // bbls
    await this.server.createList('bbl', 1);
    await fillIn('[data-test-bbl-list="bbl-input"]', '1001440001');
    await click('[data-test-bbl-list="bbl-add"]');

    // residential
    await fillIn('[data-test-housing-units-total]', 1000);
    await fillIn('[data-test-housing-units-senior]', 50);
    await fillIn('[data-test-housing-units-affordable]', 250);

    // create project
    await click('[data-test-create-project=""]');
    assert.equal(currentURL(), '/project/1');

    // go to the Air Quality download route
    await click('[data-test-chapter="air-quality"]');
    assert.equal(currentURL(), '/data/air-quality');
  });

  test('access air quality download route from topbar', async function(assert) {
    this.server.create('user');

    await visit('/');

    // go to the Air Quality download route
    await click('[data-test-topbar-link="air-quality"]');
    assert.equal(currentURL(), '/data/air-quality');
  });
});
