import Route from '@ember/routing/route';
import normalizeCartoVectors from 'carto-promises-utility/utils/normalize-carto-vectors';
import { hash } from 'rsvp';

export default class ProjectRoute extends Route {
  model = async function(params) {
    const sources = await this.store.findAll('source')
      .then(sourceModels => normalizeCartoVectors(sourceModels.toArray()));

    const project = this.get('store').createRecord('project', {
      projectId: params.project_id,
      address: "120 Broadway",
      yearBuilt: 2019,
      totalUnits: 0,
      seniorUnits: 0,
      bbls: [3019260010],
      directEffect: false,
    });

    return hash({ sources, project });
  }
}
