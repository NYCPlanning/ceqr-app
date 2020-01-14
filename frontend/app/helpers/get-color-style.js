import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';

/**
 * Returns an html-safe CSS color style attribute string for a given color string.
 * Mostly exists to get rid of an ember warning about binding style attributes.
 */
export function getColorStyle(params/* , hash */) {
  const [color] = params;
  return htmlSafe(`color:${color}`);
}

export default helper(getColorStyle);
