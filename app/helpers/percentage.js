import { helper } from '@ember/component/helper';

export function percentage([value]) {
  let percent = Math.round(value * 100);

  return `${percent}%`;
}

export default helper(percentage);