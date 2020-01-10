import { helper } from '@ember/component/helper';

/**
 * Helper for CensusTractsTable component that calculates an aggregate modal split estimate
 * for a given variable, for a full set of modal split data from all census tracts in a
 * study selection.
 */
export function getAggregateValue(params/* , hash */) {
  const [allModalSplitData, variables] = params;

  if (allModalSplitData && Array.isArray(allModalSplitData) && variables && Array.isArray(variables)) {
    return allModalSplitData.reduce((runningSum, modalSplit) => runningSum + variables.reduce((runningSum, variable) => (modalSplit[variable] ? runningSum + parseFloat(modalSplit[variable].value) : runningSum),
      0), 0);
  }
}

export default helper(getAggregateValue);
