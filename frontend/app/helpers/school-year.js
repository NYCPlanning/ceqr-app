import { helper } from '@ember/component/helper';

export function schoolYear(schema) {
  if (schema[0]) {
    return `${schema[0].minYear}-${schema[0].maxYear}`;
  } else {
    return '';
  }
}

export default helper(schoolYear);
