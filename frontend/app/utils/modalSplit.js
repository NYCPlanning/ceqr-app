import aggregateMarginOfError from 'labs-ceqr/utils/aggregateMarginOfError';
import ENV from 'labs-ceqr/config/environment';

/**
 * Lookup table for human-readable "mode" from census estimate "variable"
 */
// TODO: Flesh out human readable labels
export const VARIABLE_MODE_LOOKUP = {
  // Total w/ work from home
  trans_total: 'Total (census)',
  // Total w/o work from home
  trans_commuter_total: 'Total (w/o work from home)',
  // Public transportation value is hardcoded, not a sum of other fields.
  trans_public_total: 'Public Transportation (excluding taxicab)',
  // Vehicle Occupancy is calculated from automobile variables.
  vehicle_occupancy: 'Vehicle Occupancy',

  // Base units. 'population' is used if ACS, 'workers' if ctpp
  population: 'Population',
  workers: 'Workers',

  // Individual commuter variables
  trans_auto_total: 'Auto (Car, Truck or Van)',
  trans_public_bus: 'Bus (or trolley bus)',
  trans_public_streetcar: 'Streetcar or trolley car',
  trans_public_subway: 'Subway (or elevated)',
  trans_public_rail: 'Railroad',
  trans_public_ferry: 'Ferryboat',
  trans_taxi: 'Taxicab',
  trans_motorcycle: 'Motorcycle',
  trans_bicycle: 'Bicycle',
  trans_walk: 'Walked',
  trans_other: 'Other means',

  // Auto breakdown codes
  trans_auto_solo: 'Drove Alone',
  trans_auto_2: 'In 2-person carpool',
  trans_auto_3: 'In 3-person carpool',
  trans_auto_4: 'In 4-person carpool',
  trans_auto_5_or_6: 'In 5-or-6-person carpool',
  trans_auto_7_or_more: 'In 7-or-more-person carpool',

  // Carpool total
  trans_auto_carpool_total: 'Carpooled total',

  // Work from home
  trans_home: 'Worked at home',
};

/**
 * Variables that comprise the full set of commuters.
 * This is a subset of VARIABLE_MODE_LOOKUP
 */
export const COMMUTER_VARIABLES = [
  'trans_auto_total',
  'trans_public_bus',
  'trans_public_ferry',
  'trans_public_rail',
  'trans_public_streetcar',
  'trans_public_subway',
  'trans_taxi',
  'trans_walk',
  'trans_bicycle',
  'trans_motorcycle',
  'trans_other',
];

/**
 * Variables that break down Auto Total (trans_auto_total).
 * This is a subset of VARIABLE_MODE_LOOKUP.
 */
export const AUTO_BREAKDOWN_VARIABLES = [
  'trans_auto_solo',
  'trans_auto_2',
  'trans_auto_3',
  'trans_auto_4',
  'trans_auto_5_or_6',
  'trans_auto_7_or_more',
];

/**
* Maps auto breakdown variable code to its occupancy rate
* (Number of people in that type of vehicle)
*/
export const AUTO_OCCUPANCY_RATES = {
  trans_auto_solo: 1,
  trans_auto_2: 2,
  trans_auto_3: 3,
  trans_auto_4: 4,
  trans_auto_5_or_6: 5.5,
  trans_auto_7_or_more: 7,
};

export const MODAL_SPLIT_VARIABLES_SUBSET = [
  'trans_auto_total',
  'trans_taxi',
  'trans_public_bus',
  'trans_public_subway',
  'trans_walk',
];

/**
 * Helper function to create headers for making authenticated call
 * @params session The session
 */
export function getHeaders(session) {
  const conf = ENV['ember-simple-auth-token'] || {};
  const tokenPropertyName = conf.tokenPropertyName || 'token';
  const tokenPrefix = conf.authorizationPrefix === '' ? '' : conf.authorizationPrefix || 'Bearer';
  const token = session.data.authenticated[tokenPropertyName];

  if (!session.isAuthenticated || !token) return {};
  return { Authorization: `${tokenPrefix} ${token}` };
}

/**
 * Helper function to compose modal-split object from multiple transportation-census-estimate
 * objects returned by the rails service. Estimate objects get 'mode' property, and are
 * flattened into a single object. Additional convenience commuterTotal field is added for
 * calculating modal split percents.
 * @param rawData The JSON-serialized response from the rails backend
 * @returns The formatted modal-split object
 */
export function composeModalSplit(rawData) {
  const modalSplitObject = makeModalSplitObject(rawData);
  addCommuterTotal(modalSplitObject);
  addCombinedWalkOther(modalSplitObject);
  addVehicleOccupancy(modalSplitObject);
  return modalSplitObject;
}

/**
 * Helper function to turn estimate rows into modal-split object
 */
export function makeModalSplitObject(rawData) {
  const formatted = {};
  rawData.map(({ attributes }) => {
    formatted[attributes.variable] = {
      mode: VARIABLE_MODE_LOOKUP[attributes.variable] || 'Unknown',
      ...attributes,
    };
  });
  return formatted;
}

/**
 * Helper function to calculate and add the trans_commuter_total property to composed
 * modal-split object
 * @param modalSplit The modal-split object to modify
 */
export function addCommuterTotal(modalSplit) {
  modalSplit.trans_commuter_total = {};
  modalSplit.trans_commuter_total.variable = 'trans_commuter_total';
  modalSplit.trans_commuter_total.value = calculateCommuterTotalValue(modalSplit);
  modalSplit.trans_commuter_total.moe = calculateCommuterTotalMOE(modalSplit);
  modalSplit.trans_commuter_total.mode = VARIABLE_MODE_LOOKUP.trans_commuter_total || 'Unknown';
}

/**
 * Helper function to calculate the commuter_total value, by summing the value of all variables
 * representing a meaningful count of commuters
 * @param modalSplit The modal-split object used to calculate commuter_total
 */
function calculateCommuterTotalValue(modalSplit) {
  return COMMUTER_VARIABLES.reduce((commuterTotal, variable) => commuterTotal + modalSplit[variable].value, 0);
}

/**
 * Helper function to calculate the commuter_total moe, by computing an aggregate MOE for all
 * variables representing a meaningful count of commuters
 * @param modalSplit The modal-split object used to calculate commuter_total
 */
function calculateCommuterTotalMOE(modalSplit) {
  return aggregateMarginOfError(COMMUTER_VARIABLES.map((variable) => modalSplit[variable].moe));
}

/**
 * Helper function to calculate and add the trans_walk_other property to
 * composed modal-split object
 * @param modalSplit The modal-split object to modify
 */
export function addCombinedWalkOther(modalSplit) {
  modalSplit.trans_walk_other = {};
  modalSplit.trans_walk_other.variable = 'trans_walk_other';
  modalSplit.trans_walk_other.value = modalSplit.trans_walk.value + modalSplit.trans_other.value;
  modalSplit.trans_walk_other.moe = aggregateMarginOfError([modalSplit.trans_walk.moe, modalSplit.trans_other.moe]);
  modalSplit.trans_walk_other.mode = VARIABLE_MODE_LOOKUP.trans_walk_other || 'Unknown';
}

export function addVehicleOccupancy(modalSplit) {
  modalSplit.vehicle_occupancy = {};
  modalSplit.vehicle_occupancy.variable = 'vehicle_occupancy';
  modalSplit.vehicle_occupancy.value = calculateVehicleOccupancy(modalSplit);
  modalSplit.vehicle_occupancy.moe = null;
  modalSplit.vehicle_occupancy.mode = VARIABLE_MODE_LOOKUP.vehicle_occupancy || 'Unknown';
}

export function calculateVehicleOccupancy(modalSplit) {
  const numVehicles = AUTO_BREAKDOWN_VARIABLES.reduce((acc, cur) => acc + (modalSplit[cur].value / AUTO_OCCUPANCY_RATES[modalSplit[cur].variable]), 0);
  return (modalSplit.trans_auto_total.value / numVehicles).toFixed(2);
}
