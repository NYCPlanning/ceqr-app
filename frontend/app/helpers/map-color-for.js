import { helper } from '@ember/component/helper';
import mapColors from '../utils/mapColors';

export function mapColorFor([level]) {
  return mapColors.styleFor(level);
}

export default helper(mapColorFor);
