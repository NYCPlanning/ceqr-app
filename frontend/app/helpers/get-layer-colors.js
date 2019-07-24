import { helper } from '@ember/component/helper';
import { colors } from 'labs-ceqr/layer-styles';

export function getLayerColors(params/*, hash*/) {
  const [layer] = params;
  return colors[layer] || {};
}

export default helper(getLayerColors);
