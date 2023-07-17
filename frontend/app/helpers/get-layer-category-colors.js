import { helper } from '@ember/component/helper';
import { colors } from 'labs-ceqr/layer-styles';

/**
 * Returns the colors for a given layer's styles as an iterable array of
 * category/color objects (to be used for formatting map legend).
 */
export function getLayerCategoryColors(params /* , hash */) {
  const [layer] = params;
  return colors[layer]
    ? Object.keys(colors[layer]).map((category) => ({
        category,
        color: colors[layer][category],
      }))
    : [];
}

export default helper(getLayerCategoryColors);
