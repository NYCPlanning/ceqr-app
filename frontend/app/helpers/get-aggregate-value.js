import { helper } from '@ember/component/helper';

/**
 * Helper for CensusTractsTable component that calculates an aggregate modal split estimate
 * for a given variable, for a full set of modal split data from all census tracts in a 
 * study selection.
 */
export function getAggregateValue(params/*, hash*/) {
  const [allModalSplitData, variable] = params;

  if(allModalSplitData && Array.isArray(allModalSplitData)) {
    return allModalSplitData.reduce((runningSum, modalSplit) => {
      return runningSum + modalSplit[variable].value
    }, 0);
  }
}

export default helper(getAggregateValue);
