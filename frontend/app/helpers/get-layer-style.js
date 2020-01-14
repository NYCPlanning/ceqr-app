import { helper } from '@ember/component/helper';
import { styles } from 'labs-ceqr/layer-styles';

export function getLayerStyle(params/* , hash */) {
  const [layer, type] = params;
  return styles[layer][type];
}

export default helper(getLayerStyle);
