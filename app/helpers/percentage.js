import { helper } from '@ember/component/helper';

export function percentage([value, ...rest]) {
  let percent = value * 100;

  return `${percent}%`;
}

export default helper(percentage);