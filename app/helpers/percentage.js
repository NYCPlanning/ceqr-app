import { helper } from '@ember/component/helper';
import round from '../utils/round';

export function percentage([value], { decimals = 0 }) {
  return `${round((value * 100), decimals)}%`;
}

export default helper(percentage);