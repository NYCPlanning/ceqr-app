import { Factory, association, trait } from 'ember-cli-mirage';

export default Factory.extend({
  childCareImpact: trait({
    project: association({
      bbls: ['2024130001'],
      affordableUnits: 142
    })
  }),

  noChildCareImpact: trait({
    project: association({
      bbls: ['2024130001'],
      affordableUnits: 1,
      totalUnits: null,
    })
  }),

  libraryImpact: trait({
    project: association({
      bbls: ['2024130001'],
      totalUnits: 683
    })
  }),

  noLibraryImpact: trait({
    project: association({
      bbls: ['2024130001'],
      totalUnits: 1
    })
  }),
});
