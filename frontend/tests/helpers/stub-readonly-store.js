import Service from '@ember/service';

export default function stubReadonlyStore(hooks, ret) {
  hooks.beforeEach(function() {
    const realStore = this.owner.lookup('service:readonly-ceqr-data-store');
    const readonlyDataStoreStub = Service.extend({
      find(type, geoid) {
        if (ret) ret.geoid = geoid;
        return ret ? ret : getModalSplit(geoid);
      },
      findByIds(ar) {
        return ret ? new Array(ar.length).fill(ret) : getModalSplits(ar);
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

function getModalSplits(geoids) {
  return new Array(geoids.length).fill({}).map((_, idx) => getModalSplit(geoids[idx]));
}

export function getModalSplit(geoid) {
  const modalSplit = {};
  [
    'trans_total',
    'trans_auto_total',
    'trans_public_total',
    'trans_commuter_total',
    'population',
  ].map(variable => {
    modalSplit[variable] = {
      variable,
      value: Math.floor(Math.random() * 100),
      moe: Math.floor(Math.random() * 100),
      geoid,
    };
  });

  return modalSplit;
}
