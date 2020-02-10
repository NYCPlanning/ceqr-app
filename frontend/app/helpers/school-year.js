import { helper } from '@ember/component/helper';

export function schoolYear(schema) {
  // helper functions take their arguments as an array
  // we pass in an object here, but it's changed to [{}]
  if (schema[0]) {
    return `${schema[0].minYear}-${schema[0].maxYear}`;
  }
  return '';
}

export default helper(schoolYear);
