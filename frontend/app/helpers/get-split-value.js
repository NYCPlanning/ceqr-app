import { helper } from '@ember/component/helper';

export function getSplitValue(params/* , hash */) {
  const [modalSplitData, variable] = params;

  const split = modalSplitData[variable];

  if (split) {
    return `${split.value}`;
  }

  return '';
}

export default helper(getSplitValue);
