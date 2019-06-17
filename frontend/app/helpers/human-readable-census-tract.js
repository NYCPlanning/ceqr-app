import { helper } from '@ember/component/helper';

const COUNTY_LOOKUP = {
  '085': 'Richmond County',
  '081': 'King\'s County',
  '061': 'New York County',
  '047': 'Queen\'s County',
  '005': 'Bronx County',
}

/** 
 * Helper for StudyAreaTable that composes a human-readable version of a census
 * tract from the geoid, for use as column headers
 */
export function humanReadableCensusTract(params/*, hash*/) {
  const [geoid] = params;

  const countyCode = geoid.substring(2, 5);
  const county = COUNTY_LOOKUP[countyCode];
  const tractCode = geoid.substring(5);

  return `Census Tract ${tractCode}, ${county}, New York`;
}

export default helper(humanReadableCensusTract);
