import Service from '@ember/service';
import { composeModalSplit } from 'labs-ceqr/utils/modalSplit';
import getTransportationCensusEstimateResponse from '../../mirage/helpers/get-transportation-census-estimate-response';

function getModalSplits(type, geoids) {
  return new Array(geoids.length)
    .fill({})
    .map((_, idx) => getModalSplit(type, geoids[idx]));
}

export function getModalSplit(type, geoid) {
  const { data: estimates } = getTransportationCensusEstimateResponse(
    type,
    geoid
  );
  const modalSplit = composeModalSplit(estimates);
  return modalSplit;
}

export default function stubReadonlyStore(hooks, mockModalSplit) {
  hooks.beforeEach(function () {
    const realStore = this.owner.lookup('service:readonly-ceqr-data-store');
    const readonlyDataStoreStub = Service.extend({
      findByIds(type, ar) {
        if (mockModalSplit) {
          return new Array(ar.length).fill(mockModalSplit);
        }
        if (type === 'ACS-modal-split') {
          return getModalSplits('ACS', ar);
        }
        if (type === 'CTPP-modal-split') {
          return getModalSplits('CTPP', ar);
        }
        return new Promise(function (resolve, reject) {
          reject(`Fetch for ${type} not implemented`);
        });
      },
      find(type, geoid) {
        if (mockModalSplit) mockModalSplit.geoid = geoid;
        return mockModalSplit || getModalSplit(type, geoid);
      },
      init: function() { // eslint-disable-line
        this._super(...arguments);
        this.set('storeHash', {});
      },
      add: realStore.add,
      getRecord: realStore.getRecord,
    });
    this.owner.unregister('service:readonly-ceqr-data-store');
    this.owner.register(
      'service:readonly-ceqr-data-store',
      readonlyDataStoreStub
    );
  });
}
