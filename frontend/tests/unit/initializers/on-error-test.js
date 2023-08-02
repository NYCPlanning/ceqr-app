import Application from '@ember/application';

import { initialize } from 'labs-ceqr/initializers/on-error';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';

module('Unit | Initializer | on-error', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.TestApplication = class extends Application {};
    this.TestApplication.initializer({
      name: 'initializer under test',
      initialize,
    });

    this.application = this.TestApplication.create({ autoboot: false });
  });

  hooks.afterEach(function () {
    run(this.application, 'destroy');
  });

  // Replace this with your real tests.
  test('it works', async function (assert) {
    await this.application.boot();

    assert.ok(true);
  });
});
