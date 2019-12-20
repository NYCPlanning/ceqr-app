import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  landUse: 'residential',
  manualModeSplits: false,
  inOutSplits: () => ({
    am: { in: 50, out: 50 },
    md: { in: 50, out: 50 },
    pm: { in: 50, out: 50 },
    saturday: { in: 50, out: 50 }
  }),
  censusTractVariables: () => [
    {
      "population": {
        "moe": 569,
        "geoid": "2332",
        "value": 5415,
        "variable": "population"
      },
      "trans_home": {
        "moe": 153,
        "geoid": "2332",
        "value": 385,
        "variable": "trans_home"
      },
      "trans_taxi": {
        "moe": 154,
        "geoid": "2332",
        "value": 237,
        "variable": "trans_taxi"
      },
      "trans_walk": {
        "moe": 177,
        "geoid": "2332",
        "value": 605,
        "variable": "trans_walk"
      },
      "trans_other": {
        "moe": 28,
        "geoid": "2332",
        "value": 17,
        "variable": "trans_other"
      },
      "trans_total": {
        "moe": 312,
        "geoid": "2332",
        "value": 3210,
        "variable": "trans_total"
      },
      "trans_auto_2": {
        "moe": 32,
        "geoid": "2332",
        "value": 30,
        "variable": "trans_auto_2"
      },
      "trans_auto_3": {
        "moe": 16,
        "geoid": "2332",
        "value": 0,
        "variable": "trans_auto_3"
      },
      "trans_auto_4": {
        "moe": 16,
        "geoid": "2332",
        "value": 0,
        "variable": "trans_auto_4"
      },
      "trans_bicycle": {
        "moe": 68,
        "geoid": "2332",
        "value": 82,
        "variable": "trans_bicycle"
      },
      "trans_auto_solo": {
        "moe": 96,
        "geoid": "2332",
        "value": 135,
        "variable": "trans_auto_solo"
      },
      "trans_auto_total": {
        "moe": 99,
        "geoid": "2332",
        "value": 165,
        "variable": "trans_auto_total"
      },
      "trans_motorcycle": {
        "moe": 16,
        "geoid": "2332",
        "value": 0,
        "variable": "trans_motorcycle"
      },
      "trans_public_bus": {
        "moe": 16,
        "geoid": "2332",
        "value": 0,
        "variable": "trans_public_bus"
      },
      "trans_auto_5_or_6": {
        "moe": 16,
        "geoid": "2332",
        "value": 0,
        "variable": "trans_auto_5_or_6"
      },
      "trans_public_rail": {
        "moe": 74,
        "geoid": "2332",
        "value": 77,
        "variable": "trans_public_rail"
      },
      "trans_public_ferry": {
        "moe": 16,
        "geoid": "2332",
        "value": 0,
        "variable": "trans_public_ferry"
      },
      "trans_public_total": {
        "moe": 300,
        "geoid": "2332",
        "value": 1719,
        "variable": "trans_public_total"
      },
      "trans_public_subway": {
        "moe": 291,
        "geoid": "2332",
        "value": 1642,
        "variable": "trans_public_subway"
      },
      "trans_auto_7_or_more": {
        "moe": 16,
        "geoid": "2332",
        "value": 0,
        "variable": "trans_auto_7_or_more"
      },
      "trans_public_streetcar": {
        "moe": 16,
        "geoid": "2332",
        "value": 0,
        "variable": "trans_public_streetcar"
      },
      "trans_auto_carpool_total": {
        "moe": null,
        "geoid": "2332",
        "value": null,
        "variable": "trans_auto_carpool_total"
      }
    },
    {
      "population": {
        "moe": 315,
        "geoid": "2372",
        "value": 2674,
        "variable": "population"
      },
      "trans_home": {
        "moe": 54,
        "geoid": "2372",
        "value": 118,
        "variable": "trans_home"
      },
      "trans_taxi": {
        "moe": 67,
        "geoid": "2372",
        "value": 113,
        "variable": "trans_taxi"
      },
      "trans_walk": {
        "moe": 127,
        "geoid": "2372",
        "value": 458,
        "variable": "trans_walk"
      },
      "trans_other": {
        "moe": 52,
        "geoid": "2372",
        "value": 33,
        "variable": "trans_other"
      },
      "trans_total": {
        "moe": 263,
        "geoid": "2372",
        "value": 1689,
        "variable": "trans_total"
      },
      "trans_auto_2": {
        "moe": 43,
        "geoid": "2372",
        "value": 36,
        "variable": "trans_auto_2"
      },
      "trans_auto_3": {
        "moe": 11,
        "geoid": "2372",
        "value": 0,
        "variable": "trans_auto_3"
      },
      "trans_auto_4": {
        "moe": 11,
        "geoid": "2372",
        "value": 0,
        "variable": "trans_auto_4"
      },
      "trans_bicycle": {
        "moe": 40,
        "geoid": "2372",
        "value": 50,
        "variable": "trans_bicycle"
      },
      "trans_auto_solo": {
        "moe": 48,
        "geoid": "2372",
        "value": 72,
        "variable": "trans_auto_solo"
      },
      "trans_auto_total": {
        "moe": 70,
        "geoid": "2372",
        "value": 108,
        "variable": "trans_auto_total"
      },
      "trans_motorcycle": {
        "moe": 11,
        "geoid": "2372",
        "value": 0,
        "variable": "trans_motorcycle"
      },
      "trans_public_bus": {
        "moe": 11,
        "geoid": "2372",
        "value": 0,
        "variable": "trans_public_bus"
      },
      "trans_auto_5_or_6": {
        "moe": 11,
        "geoid": "2372",
        "value": 0,
        "variable": "trans_auto_5_or_6"
      },
      "trans_public_rail": {
        "moe": 14,
        "geoid": "2372",
        "value": 9,
        "variable": "trans_public_rail"
      },
      "trans_public_ferry": {
        "moe": 11,
        "geoid": "2372",
        "value": 0,
        "variable": "trans_public_ferry"
      },
      "trans_public_total": {
        "moe": 195,
        "geoid": "2372",
        "value": 809,
        "variable": "trans_public_total"
      },
      "trans_public_subway": {
        "moe": 195,
        "geoid": "2372",
        "value": 800,
        "variable": "trans_public_subway"
      },
      "trans_auto_7_or_more": {
        "moe": 11,
        "geoid": "2372",
        "value": 0,
        "variable": "trans_auto_7_or_more"
      },
      "trans_public_streetcar": {
        "moe": 11,
        "geoid": "2372",
        "value": 0,
        "variable": "trans_public_streetcar"
      },
      "trans_auto_carpool_total": {
        "moe": null,
        "geoid": "2372",
        "value": null,
        "variable": "trans_auto_carpool_total"
      }
    },
  ],
});
