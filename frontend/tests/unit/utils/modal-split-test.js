import
{
  fetchAndSaveModalSplit,
  fetchModalSplit,
  getHeaders,
  composeModalSplit,
  addCommuterTotal,
  VARIABLE_MODE_LOOKUP,
} from 'labs-ceqr/utils/modal-split';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import stubReadonlyStore from '../../helpers/stub-readonly-store';

module('Unit | Utility | modal-split', function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);
  stubReadonlyStore(hooks);

  test('it requests transportation-census-estimates and saves the composed result to the store', async function(assert) {
    const session = { data: { authenticated: { token: 'testToken' } }, isAuthenticated: true };
    const store = await this.owner.lookup('service:readonly-ceqr-data-store');
    const geoid = '1';

    const modalSplit = await fetchAndSaveModalSplit(geoid, session, store);

    assert.ok(modalSplit);
    assert.ok(store.getRecord('modal-split', geoid));
  });

  test('it requests transportation-census-estimates from the server and returns the json-parsed "data"', async function(assert) {
    // If a session exists with expected properties
    const session = { data: { authenticated: { token: 'testToken' } } };

    // When fetchModalSplit is called with a session and a geoid
    const result = await fetchModalSplit(session, 'testGeoid');

    // Then data is requested from the server and processed correctly (the 'data' portion of the json-parsed result is returned)
    // confirmed by asserting:
    // - the 'data' key is not present
    // - the returned object is an array
    assert.notOk(Object.keys(result).includes('data'));
    assert.ok(Array.isArray(result));
  });

  test('it properly creates HTTP headers from session', function(assert) {
    // If a session exists that is not authenticated
    const notAuthenticatedSession = { data: { authenticated: { token: 'testToken' } } };

    // When headers are generated
    const notAuthenticatedHeaders = getHeaders(notAuthenticatedSession);

    // Then the headers are empty
    assert.equal(Object.keys(notAuthenticatedHeaders).length, 0);

    // If a session exists without a token
    const noTokenSession = { data: { authenticated: {} }, isAuthenticated: true };

    // When headers are generated
    const noTokenHeaders = getHeaders(noTokenSession);

    // Then the headers are empty
    assert.equal(Object.keys(noTokenHeaders).length, 0);

    // If an authenticated session exists with a token
    const session = { data: { authenticated: { token: 'testToken' } }, isAuthenticated: true };

    // When headers are generated
    const headers = getHeaders(session);

    // Then Authorization header exists
    assert.ok(Object.keys(headers).includes('Authorization'), 'Authorization header missing');
    assert.ok(headers.Authorization.includes('testToken'));
  });

  test('it composes a modal split from transportation census estimates', function(assert) {
    // If raw transportation census estimates exist for then given variables and values
    const estimates = [
      { attributes: { variable: 'trans_total', value: 10 } },
      { attributes: { variable: 'trans_auto_total', value: 5 } },
      { attributes: { variable: 'trans_public_total', value: 2 } },
      { attributes: { variable: 'trans_home', value: 1 } },
      { attributes: { variable: 'some_madeup_var', value: 0 } },
    ];

    // When modalSplit is composed from raw estimates
    const modalSplit = composeModalSplit(estimates);

    // Then the modal split is composed correctly
    // Assert is not an array
    assert.notOk(Array.isArray(modalSplit));
    // Assert has variables as keys
    estimates.forEach((estimate) => {
      assert.ok(Object.keys(modalSplit).includes(estimate.attributes.variable));
    });
    // Assert human-readable modes were added
    Object.values(modalSplit).forEach((split) => {
      assert.ok(Object.keys(split).includes('mode'));
      const mode = VARIABLE_MODE_LOOKUP[split.variable] || 'Unknown';
      assert.equal(split.mode, mode);
    });
    // Assert commuter total value was added
    assert.ok(modalSplit.trans_commuter_total);
  });

  test('it adds commuter total', function(assert) {
    // If modalSplit object exists with trans_total and trans_home
    const modalSplit =  {
      trans_total: { variable: 'trans_total', value: 10 },
      trans_home: { variable: 'trans_home', value: 1 }
    };

    // When commuter total is added
    addCommuterTotal(modalSplit);

    // Then 'trans_commuter_total' property is added to modalSplit
    assert.ok(modalSplit.trans_commuter_total);
    assert.ok(modalSplit.trans_commuter_total.mode);
    assert.equal(modalSplit.trans_commuter_total.moe, null);
    assert.equal(modalSplit.trans_commuter_total.variable, 'trans_commuter_total');
    assert.equal(modalSplit.trans_commuter_total.value, modalSplit.trans_total.value - modalSplit.trans_home.value);
   
  })

});
