import Service from '@ember/service';
import { composeModalSplit } from 'labs-ceqr/utils/modalSplit';
import getTransportationCensusEstimateResponse from '../../mirage/helpers/get-transportation-census-estimate-response';

export default function stubReadonlyStore(hooks, ret) {
  hooks.beforeEach(function() {
    const realStore = this.owner.lookup('service:readonly-ceqr-data-store');
    const readonlyDataStoreStub = Service.extend({
      find(type, geoid) {
        if (ret) ret.geoid = geoid;
        return ret ? ret : getModalSplit(type, geoid);
      },
      findByIds(type, ar) {
        return ret ? new Array(ar.length).fill(ret) : getModalSplits(type, ar);
      },
      init: function() { // eslint-disable-line
        this.set('storeHash', {});
      },
      add : realStore.add,
      getRecord: realStore.getRecord,
    });
    this.owner.unregister('service:readonly-ceqr-data-store');
    this.owner.register('service:readonly-ceqr-data-store', readonlyDataStoreStub);
  });  
}

function getModalSplits(type, geoids) {
  return new Array(geoids.length).fill({}).map((_, idx) => getModalSplit(type, geoids[idx]));
}

export function getModalSplit(type, geoid) {
  const { data: estimates } = getTransportationCensusEstimateResponse(type, geoid);
  const modalSplit = composeModalSplit(estimates);
  return modalSplit;
}
