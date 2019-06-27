import aggregateMarginOfError from 'labs-ceqr/utils/aggregateMarginOfError';
import ENV from 'labs-ceqr/config/environment';

/**
 * Lookup table for human-readable "mode" from census estimate "variable"
 */
export const VARIABLE_MODE_LOOKUP = {
  trans_auto_total: 'Auto',
  trans_taxi: 'Taxi',
  trans_public_subway: 'Subway',
  trans_public_bus: 'Bus',
  trans_walk_other: 'Walk/Other',
  trans_commuter_total: 'Total (w/o work from home)',
};

/**
 * Variables that comprise the full set of commuters
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
 * fetchAndSave function for readonly-ceqr-data-store fetch(); makes an
 * authenticated call to the rails backend to get estimates for a given geoid, 
 * and composes the results into a single modal-split object
 * @param type The type of estimate to request, ACS or CTPP
 * @param geoid The geoid to get estimate resources for
 * @param session The session, used to authenticate the request
 * @param store The store to save the formatted modal-split object back to
 * @returns Formatted modal-split object
 */
export async function fetchAndSaveModalSplit(type, geoid, session, store) {
  try {
    const rawModalSplitEstimates = type === 'ACS' ? await fetchACSModalSplit(session, geoid) : await fetchCTPPModalSplit(session,geoid);
    const modalSplit = composeModalSplit(rawModalSplitEstimates);
    store.add(`${type}-modal-split`, geoid, modalSplit);
    return modalSplit;
  } catch (e) {
    console.log(`Error fetching acs-modal-split data for geoid: ${geoid}`, e); // eslint-disable-line
    return {};
  }
}

/**
 * Helper function to request the resources from the server
 */
export async function fetchACSModalSplit(session, geoid) {
  const path = `acs-estimates?filter[geoid]=${geoid}`;
  const res = await fetch(
    `${ENV.host}/api/v1/${path}`,
    { headers: getHeaders(session) }
  );
  const rawACSModalSplitEstimates = await res.json();
  return rawACSModalSplitEstimates.data;
}

/**
 * Helper function to request the resources from the server
 */
export async function fetchCTPPModalSplit(session, geoid) {
  const path = `ctpp-estimates?filter[geoid]=${geoid}`;
  const res = await fetch(
    `${ENV.host}/api/v1/${path}`,
    { headers: getHeaders(session) }
  );
  const rawCTPPModalSplitEstimates = await res.json();
  return rawCTPPModalSplitEstimates.data;
}

/**
 * Helper function to create headers for making authenticated call
 * @params session The session
 */
export function getHeaders(session) {
  const conf = ENV['ember-simple-auth-token'] || {};
  const tokenPropertyName = conf.tokenPropertyName || 'token';
  const tokenPrefix = conf.authorizationPrefix === '' ? '' : conf.authorizationPrefix || 'Bearer';
  const token = session.data.authenticated[tokenPropertyName];

  if(!session.isAuthenticated || !token) return {};
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
      ...attributes
    }
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
  modalSplit.trans_commuter_total.mode = VARIABLE_MODE_LOOKUP['trans_commuter_total'] || 'Unknown';
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
  return aggregateMarginOfError(COMMUTER_VARIABLES.map(variable => modalSplit[variable].moe));
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
  modalSplit.trans_walk_other.mode = VARIABLE_MODE_LOOKUP['trans_walk_other'] || 'Unknown';

}
