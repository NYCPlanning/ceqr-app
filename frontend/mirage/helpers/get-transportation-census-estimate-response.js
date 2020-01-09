import { COMMUTER_VARIABLES, AUTO_BREAKDOWN_VARIABLES } from 'labs-ceqr/utils/modalSplit';
import faker from 'faker';

export default function getTransportationCensusEstimateResponse(type) {
  const estimates = createTransportationCensusEstimates(type);
  const attributes = estimates.map((estimate) => { return {attributes: estimate} });
  return { data: [...attributes] };
}

// Ideally a unique geoid is passed in for each call to this function.
function createTransportationCensusEstimates(type, geoid) {

  const fakeGeoid = geoid ? geoid : `${(Math.random().toFixed(2)*100).toString().padEnd(11, '0')}`;

  const totalVariable = type === 'ACS' ? 'population' : 'workers';
  const variables = [
    totalVariable,
    'trans_total',
    'trans_auto_total',
    'trans_public_total',
    ...COMMUTER_VARIABLES,
    ...AUTO_BREAKDOWN_VARIABLES
  ];

  const censusEstimates = variables.map((variable) => {
    return {
      geoid: fakeGeoid,
      variable: variable,
      value: faker.random.number({min:10, max:1000}),
      moe: faker.random.number({min:1, max:20}),
    };
  });

  return censusEstimates;
}
