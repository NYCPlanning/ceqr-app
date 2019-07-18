import { helper } from '@ember/component/helper';

/** 
 * Helper that calculates an aggregate modal split percent 
 * for a full set of modal split data for all census tracts in a study selection.
 * Accepts multiple variables, so modal splits for a random subset of modes can be calculated.
 * @param {Object[]} allModalSplitData - array of Census Tract ModalSplits
 * @param {String[]} variables - array of mode variable codes 
 * @param {Bool} includePctSign -- set to True to return a string with % symbol appended.
 * False for integer value. Defaults to True;
 */
export function getAggregatePercent(params/*, hash*/) {
  let [allModalSplitData, variables, includePctSign] = params;

  if (includePctSign == null) includePctSign = true;

  if (allModalSplitData && Array.isArray(allModalSplitData) && variables && Array.isArray(variables)) {
    // calculate the aggregate of the sums of given variables for all modal splits
    const partTotal = allModalSplitData.reduce((runningSum, modalSplit) => {
      return runningSum + variables.reduce((runningSum, variable) => {
        return modalSplit[variable] ? runningSum + modalSplit[variable].value : runningSum;
      }, 0);
    }, 0);

    // calculate the aggregate total for all modal splits
    const wholeTotal = allModalSplitData.reduce((runningSum, modalSplit) => {
      // TODO: Write some alert for if any mode variables have undefined value?
      // Also, investigate whether users would like the wholeTotal to be invalidated if there's a modalSplit
      // with missing trans_commuter_total value.
      return modalSplit.trans_commuter_total ? runningSum + modalSplit.trans_commuter_total.value : runningSum;
    }, 0);

    // calculate to percent
    const percent = (partTotal/wholeTotal) * 100;

    // return formatted percent 
    return isNaN(percent) ? '-' : ((includePctSign) ? `${percent.toFixed(1)} %` : percent.toFixed(1));
  }
}

export default helper(getAggregatePercent);
