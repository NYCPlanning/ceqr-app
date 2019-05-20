import { module, test } from 'qunit';
import { visit, fillIn, click, find, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | user can create public schools analysis', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /', async function(assert) {
    await visit('/');
    await fillIn('[data-test-login-form="email"]', 'user@email.com');
    await fillIn('[data-test-login-form="password"]', 'password');
    await click('[data-test-login-form="login"]');
    await click('[data-test-new-project]');
    await fillIn("[data-test-new-project='project-name']", 'Prospect Acres')
    await click("[data-test-new-project='build-year']");
    await click("[data-test-new-project='2021']", '');
    await fillIn("[data-test-new-project='ceqr-number']", 'esnesenon');

    // bbls
    await this.server.createList('bbl', 1);
    await fillIn('[data-test-bbl-list="bbl-input"]', '1001440001');
    await click('[data-test-bbl-list="bbl-add"]');

    // residential
    await fillIn("[data-test-housing-units-total]", 1000);
    await fillIn("[data-test-housing-units-senior]", 50);
    await fillIn("[data-test-housing-units-affordable]", 250);

    // commercial
    await click("[data-test-commercial-use='dropdown']");
    await click("[data-test-commercial-use='Office']");
    await fillIn("[data-test-commercial-use='sq-ft']", 100);
    await click("[data-test-commercial-use='add']");
    // assert.ok(find("[data-test-commercial-use='Office']")); // these are flakey

    // community facilities
    await click("[data-test-community-facility='dropdown']");
    await click("[data-test-community-facility='General Community Facility']");
    await fillIn("[data-test-community-facility='sq-ft']", 50);
    await click("[data-test-community-facility='add']");
    // assert.ok(find("[data-test-community-facility='General Community Facility']")); // these are flakey

    await click("[data-test-community-facility='remove']");
    // assert.ok(!find("[data-test-community-facility='General Community Facility']")); // these are flakey

    // industrial uses
    await click("[data-test-industrial-use='dropdown']");
    await click("[data-test-industrial-use='Warehouse Space']");
    await fillIn("[data-test-industrial-use='sq-ft']", 50);
    await click("[data-test-industrial-use='add']");
    await find("[data-test-industrial-use='Warehouse Space']");
    await click("[data-test-industrial-use='remove']");

    // parking
    await click("[data-test-parking='dropdown']");
    await click("[data-test-parking='Garages']");
    await fillIn("[data-test-parking='spaces']", 1000);
    await click("[data-test-parking='add']");
    await find("[data-test-parking='Garages']");
    await click("[data-test-parking='remove']");
    await click('[data-test-create-project=""]');

    assert.equal(currentURL(), '/project/1');
  });
});
