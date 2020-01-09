import
{
  getHeaders,
  composeModalSplit,
  makeModalSplitObject, 
  addCommuterTotal,
  addCombinedWalkOther,
  addVehicleOccupancy,
  calculateVehicleOccupancy,
  AUTO_OCCUPANCY_RATES,
  VARIABLE_MODE_LOOKUP,
} from 'labs-ceqr/utils/modalSplit';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setupMirage } from "ember-cli-mirage/test-support";
import stubReadonlyStore from '../../helpers/stub-readonly-store';
import getTransportationCensusEstimateResponse from '../../../mirage/helpers/get-transportation-census-estimate-response';

module('Unit | Utility | modal-split', function(hooks) {
  setupTest(hooks);
  setupMirage(hooks); stubReadonlyStore(hooks);

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
    // If raw estimates exist
    const { data: estimates } = getTransportationCensusEstimateResponse('ACS', 'geoid');

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
    // Assert commuter total and walk/other properties were added
    assert.ok(modalSplit.trans_commuter_total);
    assert.ok(modalSplit.trans_walk_other);
  });

  test('it adds commuter total', function(assert) {
    // If modalSplit object exists with trans_total and trans_home
    const { data: estimates } = getTransportationCensusEstimateResponse('ACS', 'geoid');
    const modalSplit = makeModalSplitObject(estimates);
    
    // When commuter total is added
    addCommuterTotal(modalSplit);

    // Then 'trans_commuter_total' property is added to modalSplit
    assert.ok(modalSplit.trans_commuter_total);
    assert.ok(modalSplit.trans_commuter_total.mode);
    assert.notOk(isNaN(modalSplit.trans_commuter_total.moe));
    assert.notOk(isNaN(modalSplit.trans_commuter_total.value));
  });

  test('it adds walk/other', function(assert) {

    // If modalSplit object exists with trans_total and trans_home
    const { data: estimates } = getTransportationCensusEstimateResponse('ACS', 'geoid');
    const modalSplit = makeModalSplitObject(estimates);
    
    // When walk/other is added
    addCombinedWalkOther(modalSplit);

    // Then 'trans_walk_other' property is added to modalSplit
    assert.ok(modalSplit.trans_walk_other);
    assert.ok(modalSplit.trans_walk_other.mode);
    assert.notOk(isNaN(modalSplit.trans_walk_other.moe));
    assert.notOk(isNaN(modalSplit.trans_walk_other.value));
  });

  test('it adds vehicle occupancy', function(assert) {
    // If modalSplit object exists with trans_total and trans_home
    const { data: estimates } = getTransportationCensusEstimateResponse('ACS', 'geoid');
    const modalSplit = makeModalSplitObject(estimates);
    
    // When Vehicle Occupancy is added
    addVehicleOccupancy(modalSplit);

    // Then 'vehicle_occupancy' property is added to modalSplit
    assert.ok(modalSplit.vehicle_occupancy);
    assert.ok(modalSplit.vehicle_occupancy.mode);
    assert.notOk(modalSplit.vehicle_occupancy.moe);
    assert.notOk(isNaN(modalSplit.vehicle_occupancy.value));
  });

  test('computeVehicleOccupancy gives expected numbers', function(assert) {
    const modalSplitMock = {
      'trans_auto_total': { value: 12+8+6+8+12+14, variable: 'trans_auto_total'},
      'trans_auto_solo': { value: 12, variable: 'trans_auto_solo'},
      'trans_auto_2': { value: 8, variable: 'trans_auto_2'},
      'trans_auto_3': { value: 6, variable: 'trans_auto_3'},
      'trans_auto_4': { value: 8, variable: 'trans_auto_4'},
      'trans_auto_5_or_6': { value: 12, variable: 'trans_auto_5_or_6'},
      'trans_auto_7_or_more': { value: 14, variable: 'trans_auto_7_or_more'},
      'vehicle_occupancy': {}
    }
    let vehicleOccupancy = calculateVehicleOccupancy(modalSplitMock);
    let expectedVehicleOccupancy = modalSplitMock.trans_auto_total.value / (
      (modalSplitMock.trans_auto_solo.value / AUTO_OCCUPANCY_RATES.trans_auto_solo) + 
      (modalSplitMock.trans_auto_2.value / AUTO_OCCUPANCY_RATES.trans_auto_2) + 
      (modalSplitMock.trans_auto_3.value / AUTO_OCCUPANCY_RATES.trans_auto_3) + 
      (modalSplitMock.trans_auto_4.value / AUTO_OCCUPANCY_RATES.trans_auto_4) + 
      (modalSplitMock.trans_auto_5_or_6.value / AUTO_OCCUPANCY_RATES.trans_auto_5_or_6) + 
      (modalSplitMock.trans_auto_7_or_more.value / AUTO_OCCUPANCY_RATES.trans_auto_7_or_more) 
    );
    assert.equal(vehicleOccupancy, expectedVehicleOccupancy.toFixed(2));
  });
});
