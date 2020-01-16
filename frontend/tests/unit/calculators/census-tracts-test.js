import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import tctCalc from 'labs-ceqr/calculators/transportation/census-tracts';

module('Unit | Calculator | census-tracts', function(hooks) {
  setupTest(hooks);

  test('it calculates totalCounts', function(assert) {
    const modesForAnalysis = [
      'auto',
      'taxi',
      'bus',
      'subway',
      'walk',
      'railroad',
    ];

    const censusTractVariables = [
      {
        population: {
          moe: 569,
          geoid: '2332',
          value: 5415,
          variable: 'population',
        },
        trans_home: {
          moe: 153,
          geoid: '2332',
          value: 385,
          variable: 'trans_home',
        },
        trans_taxi: {
          moe: 154,
          geoid: '2332',
          value: 237,
          variable: 'trans_taxi',
        },
        trans_walk: {
          moe: 177,
          geoid: '2332',
          value: 605,
          variable: 'trans_walk',
        },
        trans_other: {
          moe: 28,
          geoid: '2332',
          value: 17,
          variable: 'trans_other',
        },
        trans_total: {
          moe: 312,
          geoid: '2332',
          value: 3210,
          variable: 'trans_total',
        },
        trans_auto_2: {
          moe: 32,
          geoid: '2332',
          value: 30,
          variable: 'trans_auto_2',
        },
        trans_auto_3: {
          moe: 16,
          geoid: '2332',
          value: 0,
          variable: 'trans_auto_3',
        },
        trans_auto_4: {
          moe: 16,
          geoid: '2332',
          value: 0,
          variable: 'trans_auto_4',
        },
        trans_bicycle: {
          moe: 68,
          geoid: '2332',
          value: 82,
          variable: 'trans_bicycle',
        },
        trans_auto_solo: {
          moe: 96,
          geoid: '2332',
          value: 135,
          variable: 'trans_auto_solo',
        },
        trans_auto_total: {
          moe: 99,
          geoid: '2332',
          value: 165,
          variable: 'trans_auto_total',
        },
        trans_motorcycle: {
          moe: 16,
          geoid: '2332',
          value: 0,
          variable: 'trans_motorcycle',
        },
        trans_public_bus: {
          moe: 16,
          geoid: '2332',
          value: 0,
          variable: 'trans_public_bus',
        },
        trans_auto_5_or_6: {
          moe: 16,
          geoid: '2332',
          value: 0,
          variable: 'trans_auto_5_or_6',
        },
        trans_public_rail: {
          moe: 74,
          geoid: '2332',
          value: 77,
          variable: 'trans_public_rail',
        },
        trans_public_ferry: {
          moe: 16,
          geoid: '2332',
          value: 0,
          variable: 'trans_public_ferry',
        },
        trans_public_total: {
          moe: 300,
          geoid: '2332',
          value: 1719,
          variable: 'trans_public_total',
        },
        trans_public_subway: {
          moe: 291,
          geoid: '2332',
          value: 1642,
          variable: 'trans_public_subway',
        },
        trans_auto_7_or_more: {
          moe: 16,
          geoid: '2332',
          value: 0,
          variable: 'trans_auto_7_or_more',
        },
        trans_public_streetcar: {
          moe: 16,
          geoid: '2332',
          value: 0,
          variable: 'trans_public_streetcar',
        },
        trans_auto_carpool_total: {
          moe: null,
          geoid: '2332',
          value: 2,
          variable: 'trans_auto_carpool_total',
        },
      },
      {
        population: {
          moe: 315,
          geoid: '2372',
          value: 2674,
          variable: 'population',
        },
        trans_home: {
          moe: 54,
          geoid: '2372',
          value: 118,
          variable: 'trans_home',
        },
        trans_taxi: {
          moe: 67,
          geoid: '2372',
          value: 113,
          variable: 'trans_taxi',
        },
        trans_walk: {
          moe: 127,
          geoid: '2372',
          value: 458,
          variable: 'trans_walk',
        },
        trans_other: {
          moe: 52,
          geoid: '2372',
          value: 33,
          variable: 'trans_other',
        },
        trans_total: {
          moe: 263,
          geoid: '2372',
          value: 1689,
          variable: 'trans_total',
        },
        trans_auto_2: {
          moe: 43,
          geoid: '2372',
          value: 36,
          variable: 'trans_auto_2',
        },
        trans_auto_3: {
          moe: 11,
          geoid: '2372',
          value: 0,
          variable: 'trans_auto_3',
        },
        trans_auto_4: {
          moe: 11,
          geoid: '2372',
          value: 0,
          variable: 'trans_auto_4',
        },
        trans_bicycle: {
          moe: 40,
          geoid: '2372',
          value: 50,
          variable: 'trans_bicycle',
        },
        trans_auto_solo: {
          moe: 48,
          geoid: '2372',
          value: 72,
          variable: 'trans_auto_solo',
        },
        trans_auto_total: {
          moe: 70,
          geoid: '2372',
          value: 108,
          variable: 'trans_auto_total',
        },
        trans_motorcycle: {
          moe: 11,
          geoid: '2372',
          value: 0,
          variable: 'trans_motorcycle',
        },
        trans_public_bus: {
          moe: 11,
          geoid: '2372',
          value: 0,
          variable: 'trans_public_bus',
        },
        trans_auto_5_or_6: {
          moe: 11,
          geoid: '2372',
          value: 0,
          variable: 'trans_auto_5_or_6',
        },
        trans_public_rail: {
          moe: 14,
          geoid: '2372',
          value: 9,
          variable: 'trans_public_rail',
        },
        trans_public_ferry: {
          moe: 11,
          geoid: '2372',
          value: 0,
          variable: 'trans_public_ferry',
        },
        trans_public_total: {
          moe: 195,
          geoid: '2372',
          value: 809,
          variable: 'trans_public_total',
        },
        trans_public_subway: {
          moe: 195,
          geoid: '2372',
          value: 800,
          variable: 'trans_public_subway',
        },
        trans_auto_7_or_more: {
          moe: 11,
          geoid: '2372',
          value: 0,
          variable: 'trans_auto_7_or_more',
        },
        trans_public_streetcar: {
          moe: 11,
          geoid: '2372',
          value: 0,
          variable: 'trans_public_streetcar',
        },
        trans_auto_carpool_total: {
          moe: null,
          geoid: '2372',
          value: 3,
          variable: 'trans_auto_carpool_total',
        },
      },
    ];

    const newTctCalc = tctCalc.create({
      censusTracts: censusTractVariables,
      modesForAnalysis,
    });

    // for what totalCount is, see
    // /frontend/app/calculators/transportation/census-tracts.js
    // Here, 4214 comes from the sum of values of modes specified in `modesForAnalysis`
    // across census tracts.
    // i.e. 165 + 108 + 237 + 113 + 0 + 0 + 1642 + 800 + 605 + 458 + 77 + 9 = 4214
    assert.equal(newTctCalc.totalCount, 4214);
  });

  test('it calculates modeSplits', function(assert) {
    const modesForAnalysis = [
      'auto',
      'taxi',
      'bus',
      'subway',
      'walk',
      'railroad',
    ];

    const censusTractVariables = [
      {
        population: {
          moe: 569,
          geoid: '2332',
          value: 5415,
          variable: 'population',
        },
        trans_home: {
          moe: 153,
          geoid: '2332',
          value: 385,
          variable: 'trans_home',
        },
        trans_taxi: {
          moe: 154,
          geoid: '2332',
          value: 237,
          variable: 'trans_taxi',
        },
        trans_walk: {
          moe: 177,
          geoid: '2332',
          value: 605,
          variable: 'trans_walk',
        },
        trans_other: {
          moe: 28,
          geoid: '2332',
          value: 17,
          variable: 'trans_other',
        },
        trans_total: {
          moe: 312,
          geoid: '2332',
          value: 3210,
          variable: 'trans_total',
        },
        trans_auto_2: {
          moe: 32,
          geoid: '2332',
          value: 30,
          variable: 'trans_auto_2',
        },
        trans_auto_3: {
          moe: 16,
          geoid: '2332',
          value: 0,
          variable: 'trans_auto_3',
        },
        trans_auto_4: {
          moe: 16,
          geoid: '2332',
          value: 0,
          variable: 'trans_auto_4',
        },
        trans_bicycle: {
          moe: 68,
          geoid: '2332',
          value: 82,
          variable: 'trans_bicycle',
        },
        trans_auto_solo: {
          moe: 96,
          geoid: '2332',
          value: 135,
          variable: 'trans_auto_solo',
        },
        trans_auto_total: {
          moe: 99,
          geoid: '2332',
          value: 165,
          variable: 'trans_auto_total',
        },
        trans_motorcycle: {
          moe: 16,
          geoid: '2332',
          value: 0,
          variable: 'trans_motorcycle',
        },
        trans_public_bus: {
          moe: 16,
          geoid: '2332',
          value: 0,
          variable: 'trans_public_bus',
        },
        trans_auto_5_or_6: {
          moe: 16,
          geoid: '2332',
          value: 0,
          variable: 'trans_auto_5_or_6',
        },
        trans_public_rail: {
          moe: 74,
          geoid: '2332',
          value: 77,
          variable: 'trans_public_rail',
        },
        trans_public_ferry: {
          moe: 16,
          geoid: '2332',
          value: 0,
          variable: 'trans_public_ferry',
        },
        trans_public_total: {
          moe: 300,
          geoid: '2332',
          value: 1719,
          variable: 'trans_public_total',
        },
        trans_public_subway: {
          moe: 291,
          geoid: '2332',
          value: 1642,
          variable: 'trans_public_subway',
        },
        trans_auto_7_or_more: {
          moe: 16,
          geoid: '2332',
          value: 0,
          variable: 'trans_auto_7_or_more',
        },
        trans_public_streetcar: {
          moe: 16,
          geoid: '2332',
          value: 0,
          variable: 'trans_public_streetcar',
        },
        trans_auto_carpool_total: {
          moe: null,
          geoid: '2332',
          value: 2,
          variable: 'trans_auto_carpool_total',
        },
      },
      {
        population: {
          moe: 315,
          geoid: '2372',
          value: 2674,
          variable: 'population',
        },
        trans_home: {
          moe: 54,
          geoid: '2372',
          value: 118,
          variable: 'trans_home',
        },
        trans_taxi: {
          moe: 67,
          geoid: '2372',
          value: 113,
          variable: 'trans_taxi',
        },
        trans_walk: {
          moe: 127,
          geoid: '2372',
          value: 458,
          variable: 'trans_walk',
        },
        trans_other: {
          moe: 52,
          geoid: '2372',
          value: 33,
          variable: 'trans_other',
        },
        trans_total: {
          moe: 263,
          geoid: '2372',
          value: 1689,
          variable: 'trans_total',
        },
        trans_auto_2: {
          moe: 43,
          geoid: '2372',
          value: 36,
          variable: 'trans_auto_2',
        },
        trans_auto_3: {
          moe: 11,
          geoid: '2372',
          value: 0,
          variable: 'trans_auto_3',
        },
        trans_auto_4: {
          moe: 11,
          geoid: '2372',
          value: 0,
          variable: 'trans_auto_4',
        },
        trans_bicycle: {
          moe: 40,
          geoid: '2372',
          value: 50,
          variable: 'trans_bicycle',
        },
        trans_auto_solo: {
          moe: 48,
          geoid: '2372',
          value: 72,
          variable: 'trans_auto_solo',
        },
        trans_auto_total: {
          moe: 70,
          geoid: '2372',
          value: 108,
          variable: 'trans_auto_total',
        },
        trans_motorcycle: {
          moe: 11,
          geoid: '2372',
          value: 0,
          variable: 'trans_motorcycle',
        },
        trans_public_bus: {
          moe: 11,
          geoid: '2372',
          value: 0,
          variable: 'trans_public_bus',
        },
        trans_auto_5_or_6: {
          moe: 11,
          geoid: '2372',
          value: 0,
          variable: 'trans_auto_5_or_6',
        },
        trans_public_rail: {
          moe: 14,
          geoid: '2372',
          value: 9,
          variable: 'trans_public_rail',
        },
        trans_public_ferry: {
          moe: 11,
          geoid: '2372',
          value: 0,
          variable: 'trans_public_ferry',
        },
        trans_public_total: {
          moe: 195,
          geoid: '2372',
          value: 809,
          variable: 'trans_public_total',
        },
        trans_public_subway: {
          moe: 195,
          geoid: '2372',
          value: 800,
          variable: 'trans_public_subway',
        },
        trans_auto_7_or_more: {
          moe: 11,
          geoid: '2372',
          value: 0,
          variable: 'trans_auto_7_or_more',
        },
        trans_public_streetcar: {
          moe: 11,
          geoid: '2372',
          value: 0,
          variable: 'trans_public_streetcar',
        },
        trans_auto_carpool_total: {
          moe: null,
          geoid: '2372',
          value: 3,
          variable: 'trans_auto_carpool_total',
        },
      },
    ];

    const newTctCalc = tctCalc.create({
      censusTracts: censusTractVariables,
      modesForAnalysis,
    });

    assert.deepEqual(newTctCalc.modeSplits, {
      auto: { allPeriods: 6.5, count: 273 },
      taxi: { allPeriods: 8.3, count: 350 },
      bus: { allPeriods: 0, count: 0 },
      subway: { allPeriods: 57.9, count: 2442 },
      railroad: { allPeriods: 2, count: 86 },
      walk: { allPeriods: 25.2, count: 1063 },
      ferry: { allPeriods: 0, count: 0 },
      streetcar: { allPeriods: 0, count: 0 },
      bicycle: { allPeriods: 3.1, count: 132 },
      motorcycle: { allPeriods: 0, count: 0 },
      other: { allPeriods: 1.2, count: 50 },
    });
  });

  test('it calculates autoVehicleOccupancy', function(assert) {
    const modesForAnalysis = [
      'auto',
      'taxi',
      'bus',
      'subway',
      'walk',
      'railroad',
    ];

    const censusTractVariables = [
      {
        population: {
          moe: 569,
          geoid: '2332',
          value: 5415,
          variable: 'population',
        },
        trans_home: {
          moe: 153,
          geoid: '2332',
          value: 385,
          variable: 'trans_home',
        },
        trans_taxi: {
          moe: 154,
          geoid: '2332',
          value: 237,
          variable: 'trans_taxi',
        },
        trans_walk: {
          moe: 177,
          geoid: '2332',
          value: 605,
          variable: 'trans_walk',
        },
        trans_other: {
          moe: 28,
          geoid: '2332',
          value: 17,
          variable: 'trans_other',
        },
        trans_total: {
          moe: 312,
          geoid: '2332',
          value: 3210,
          variable: 'trans_total',
        },
        trans_auto_2: {
          moe: 32,
          geoid: '2332',
          value: 30,
          variable: 'trans_auto_2',
        },
        trans_auto_3: {
          moe: 16,
          geoid: '2332',
          value: 0,
          variable: 'trans_auto_3',
        },
        trans_auto_4: {
          moe: 16,
          geoid: '2332',
          value: 0,
          variable: 'trans_auto_4',
        },
        trans_bicycle: {
          moe: 68,
          geoid: '2332',
          value: 82,
          variable: 'trans_bicycle',
        },
        trans_auto_solo: {
          moe: 96,
          geoid: '2332',
          value: 135,
          variable: 'trans_auto_solo',
        },
        trans_auto_total: {
          moe: 99,
          geoid: '2332',
          value: 165,
          variable: 'trans_auto_total',
        },
        trans_motorcycle: {
          moe: 16,
          geoid: '2332',
          value: 0,
          variable: 'trans_motorcycle',
        },
        trans_public_bus: {
          moe: 16,
          geoid: '2332',
          value: 0,
          variable: 'trans_public_bus',
        },
        trans_auto_5_or_6: {
          moe: 16,
          geoid: '2332',
          value: 0,
          variable: 'trans_auto_5_or_6',
        },
        trans_public_rail: {
          moe: 74,
          geoid: '2332',
          value: 77,
          variable: 'trans_public_rail',
        },
        trans_public_ferry: {
          moe: 16,
          geoid: '2332',
          value: 0,
          variable: 'trans_public_ferry',
        },
        trans_public_total: {
          moe: 300,
          geoid: '2332',
          value: 1719,
          variable: 'trans_public_total',
        },
        trans_public_subway: {
          moe: 291,
          geoid: '2332',
          value: 1642,
          variable: 'trans_public_subway',
        },
        trans_auto_7_or_more: {
          moe: 16,
          geoid: '2332',
          value: 0,
          variable: 'trans_auto_7_or_more',
        },
        trans_public_streetcar: {
          moe: 16,
          geoid: '2332',
          value: 0,
          variable: 'trans_public_streetcar',
        },
        trans_auto_carpool_total: {
          moe: null,
          geoid: '2332',
          value: 2,
          variable: 'trans_auto_carpool_total',
        },
      },
      {
        population: {
          moe: 315,
          geoid: '2372',
          value: 2674,
          variable: 'population',
        },
        trans_home: {
          moe: 54,
          geoid: '2372',
          value: 118,
          variable: 'trans_home',
        },
        trans_taxi: {
          moe: 67,
          geoid: '2372',
          value: 113,
          variable: 'trans_taxi',
        },
        trans_walk: {
          moe: 127,
          geoid: '2372',
          value: 458,
          variable: 'trans_walk',
        },
        trans_other: {
          moe: 52,
          geoid: '2372',
          value: 33,
          variable: 'trans_other',
        },
        trans_total: {
          moe: 263,
          geoid: '2372',
          value: 1689,
          variable: 'trans_total',
        },
        trans_auto_2: {
          moe: 43,
          geoid: '2372',
          value: 36,
          variable: 'trans_auto_2',
        },
        trans_auto_3: {
          moe: 11,
          geoid: '2372',
          value: 0,
          variable: 'trans_auto_3',
        },
        trans_auto_4: {
          moe: 11,
          geoid: '2372',
          value: 0,
          variable: 'trans_auto_4',
        },
        trans_bicycle: {
          moe: 40,
          geoid: '2372',
          value: 50,
          variable: 'trans_bicycle',
        },
        trans_auto_solo: {
          moe: 48,
          geoid: '2372',
          value: 72,
          variable: 'trans_auto_solo',
        },
        trans_auto_total: {
          moe: 70,
          geoid: '2372',
          value: 108,
          variable: 'trans_auto_total',
        },
        trans_motorcycle: {
          moe: 11,
          geoid: '2372',
          value: 0,
          variable: 'trans_motorcycle',
        },
        trans_public_bus: {
          moe: 11,
          geoid: '2372',
          value: 0,
          variable: 'trans_public_bus',
        },
        trans_auto_5_or_6: {
          moe: 11,
          geoid: '2372',
          value: 0,
          variable: 'trans_auto_5_or_6',
        },
        trans_public_rail: {
          moe: 14,
          geoid: '2372',
          value: 9,
          variable: 'trans_public_rail',
        },
        trans_public_ferry: {
          moe: 11,
          geoid: '2372',
          value: 0,
          variable: 'trans_public_ferry',
        },
        trans_public_total: {
          moe: 195,
          geoid: '2372',
          value: 809,
          variable: 'trans_public_total',
        },
        trans_public_subway: {
          moe: 195,
          geoid: '2372',
          value: 800,
          variable: 'trans_public_subway',
        },
        trans_auto_7_or_more: {
          moe: 11,
          geoid: '2372',
          value: 0,
          variable: 'trans_auto_7_or_more',
        },
        trans_public_streetcar: {
          moe: 11,
          geoid: '2372',
          value: 0,
          variable: 'trans_public_streetcar',
        },
        trans_auto_carpool_total: {
          moe: null,
          geoid: '2372',
          value: 3,
          variable: 'trans_auto_carpool_total',
        },
      },
    ];

    const newTctCalc = tctCalc.create({
      censusTracts: censusTractVariables,
      modesForAnalysis,
    });

    assert.equal(newTctCalc.autoVehicleOccupancy, 1.14);
  });
});
