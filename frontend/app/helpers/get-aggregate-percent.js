import { helper } from '@ember/component/helper';

/** 
 * Helper for CensusTractsTable component that calculates an aggregate modal split percent 
 * for a full set of modal split data for all census tracts in a study selection.
 * Accepts multiple variables, so modal splits for a random subset of modes can be calculated.
 */
export function getAggregatePercent(params/*, hash*/) {
  const [allModalSplitData, variables, includePctSign] = params;

  if(allModalSplitData && Array.isArray(allModalSplitData) && variables && Array.isArray(variables)) {
    // calculate the aggregate of the sums of given variables for all modal splits
    const partTotal = allModalSplitData.reduce((runningSum, modalSplit) => {
      return runningSum + variables.reduce((runningSum, variable) => {
        return modalSplit[variable] ? runningSum + modalSplit[variable].value : runningSum;
      }, 0);
    }, 0);

    // calculate the aggregate total for all modal splits
    const wholeTotal = allModalSplitData.reduce((runningSum, modalSplit) => {
      return runningSum + modalSplit.trans_commuter_total.value;
    }, 0);

    // calculate to percent
    const percent = (partTotal/wholeTotal) * 100;

    // return formatted percent 
    return isNaN(percent) ? '-' : ((includePctSign) ? `${percent.toFixed(1)} %` : percent.toFixed(1));
  }
}

export default helper(getAggregatePercent);
