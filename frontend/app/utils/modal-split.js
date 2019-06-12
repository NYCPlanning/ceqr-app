import ENV from 'labs-ceqr/config/environment';

/** 
 * Lookup table for human-readable "mode" from census estimate "variable"
 */
export const VARIABLE_MODE_LOOKUP = {
  trans_total: 'All',
  trans_auto_total: 'Automobile',
  trans_public_total: 'Public Transportation',
};

/**
 * fetchAndSave function for readonly-ceqr-data-store fetch(); makes an
 * authenticated call to the rails backend to get transportation-census-estiamtes
 * for a given geoid, and composes the results into a single modal-split object
 * @param session The session, used to authenticate the request
 * @param geoid The geoid to get transportation-census-estimate resources for
 * @param store The store to save the formatted modal-split object back to
 * @returns Formatted modal-split object
 */
export async function fetchAndSaveModalSplit(session, geoid, store) {
  const path = `transportation-census-estimates?filter[geoid]=${geoid}`;
  try {
    const res = await fetch(
      `${ENV.host}/api/v1/${path}`,
      { headers: getHeaders(session) }
    );
    const rawModalSplitEstimates = await res.json();
    const modalSplit = composeModalSplit(rawModalSplitEstimates.data);
    store.add('modal-split', geoid, modalSplit);
    return modalSplit;
  } catch (e) {
    console.log(`Error fetching modal-split data for geoid: ${geoid}`, e); // eslint-disable-line
    return {};
  }
}

/** 
 * Helper function to create headers for making authenticated call
 * @params session The session
 */
function getHeaders(session) {
  const conf = ENV['ember-simple-auth-token'] || {};
  const tokenPropertyName = conf.tokenPropertyName || 'token';
  const tokenPrefix = conf.authorizationPrefix === '' ? '' : conf.authorizationPrefix || 'Bearer';
  const token = session.data.authenticated[tokenPropertyName];

  if(!session.isAuthenticated || !token) return {};
  return {Authorization: `${tokenPrefix} ${token}`};
}

/** 
 * Helper function to compose modal-split object from multiple transportation-census-estimate
 * objects returned by the rails service. Estimate objects get 'mode' property, and are 
 * flattened into a single object. Additional convenience commuterTotal field is added for
 * calculating modal split percents.
 * @param rawData The JSON-serialized response from the rails backend
 * @returns The formatted modal-split object
 */
function composeModalSplit(rawData) {
  const formatted = {};
  rawData.map(({ attributes }) => {
    formatted[attributes.variable] = {
      mode: VARIABLE_MODE_LOOKUP[attributes.variable] || 'Unknown',
      ...attributes
    }
  });

  addCommuterTotal(formatted);
  return formatted;
}

/** 
 * Helper function to calculate and add the trans_commuter_total property to composed 
 * modal-split object
 * @param modalSplit The modal-split object to modify
 */
function addCommuterTotal(modalSplit) {
  modalSplit.trans_commuter_total = {};
  modalSplit.trans_commuter_total.value = modalSplit.trans_total.value - modalSplit.trans_home.value;
}

