import { helper } from '@ember/component/helper';

export function humanizeGeoid(params) {
  const [geoid] = params;

  const tractId = geoid.substring(5,9);
  const blockId = geoid.substring(9,11);

  return parseFloat(`${tractId}.${blockId}`);
}

export default helper(humanizeGeoid);
