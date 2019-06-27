import { COMMUTER_VARIABLES } from 'labs-ceqr/utils/modalSplit';
import { faker } from 'ember-cli-mirage';

export default function getTransportationCensusEstimateResponse(type) {
  const estimates = createTransportationCensusEstimates(type);
  const attributes = estimates.map((estimate) => { return {attributes: estimate} });
  return { data: [...attributes] };
}

function createTransportationCensusEstimates(type, geoid) {
  const totalVariable = type === 'ACS' ? 'population' : 'workers';
  const variables = [
    totalVariable,
    'trans_total',
    'trans_auto_total',
    'trans_public_total',
    ...COMMUTER_VARIABLES
  ];

  const censusEstimates = variables.map((variable, idx) => {
    return {
      geoid: geoid ? geoid : `${idx.toString().padEnd(11, '0')}`,
      variable: variable,
      value: faker.random.number({min:10, max:1000}),
      moe: faker.random.number({min:1, max:20}),
    };
  });

  return censusEstimates;
}
