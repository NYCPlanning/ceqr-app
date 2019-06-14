import { helper } from '@ember/component/helper';

export function getSplitValue(params/*, hash*/) {
  const [modalSplitData, variable] = params;

  return modalSplitData[variable] ? modalSplitData[variable].value : '';
}

export default helper(getSplitValue);
