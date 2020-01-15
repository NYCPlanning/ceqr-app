export const MODES = [
  'auto',
  'taxi',
  'bus',
  'subway',
  'railroad',
  'walk',
  'ferry',
  'streetcar',
  'bicycle',
  'motorcycle',
  'other',
];

// these values, e.g. "trans-auto-total" are sourced from the transportation_planning_factors table
// under the column census_tract_variables, where they are nested in objects
export const MODE_VARIABLE_LOOKUP = {
  auto: 'trans_auto_total',
  taxi: 'trans_taxi',
  bus: 'trans_public_bus',
  subway: 'trans_public_subway',
  railroad: 'trans_public_rail',
  walk: 'trans_walk',
  ferry: 'trans_public_ferry',
  streetcar: 'trans_public_streetcar',
  bicycle: 'trans_bicycle',
  motorcycle: 'trans_motorcycle',
  other: 'trans_other',
};

export function censusTractVariableForMode(mode) {
  return MODE_VARIABLE_LOOKUP[mode];
}
