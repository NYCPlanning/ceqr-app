import { helper } from '@ember/component/helper';

export function getSplitValue(params/*, hash*/) {
  const [modalSplitData, variable, includeMoe] = params;

  const split = modalSplitData[variable];

  if(split && includeMoe && split.moe) {
    return `${split.value}±${split.moe.toFixed(0)}`;
  }

  return split ? split.value : '';
}

export default helper(getSplitValue);
