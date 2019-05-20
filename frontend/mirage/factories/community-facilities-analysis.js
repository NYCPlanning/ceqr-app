import { Factory, association, trait } from 'ember-cli-mirage';

export default Factory.extend({
  childCareImpact: trait({
    project: association({
      borough: 'Bronx',
      affordableUnits: 142
    })
  }),

  noChildCareImpact: trait({
    project: association({
      borough: 'Bronx',
      affordableUnits: 1
    })
  }),

  libraryImpact: trait({
    project: association({
      borough: 'Bronx',
      totalUnits: 683
    })
  }),

  noLibraryImpact: trait({
    project: association({
      borough: 'Bronx',
      totalUnits: 1
    })
  }),
});
