import { helper } from '@ember/component/helper';

export function getSplitMoe(params/*, hash*/) {
  const [modalSplitData, variable] = params;

  const split = modalSplitData[variable];

  if(split && split.moe) {
    return `±${split.moe.toFixed(0)}`;
  }

  return '';
}

export default helper(getSplitMoe);
