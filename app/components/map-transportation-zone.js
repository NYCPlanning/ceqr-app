import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  mapdata: service(),
  map: null,

  didReceiveAttrs() {
    this._super(...arguments);
    this.get('mapdata').setProject(this.get('project'));
  },

  moveTransportationZones: function(data) {
    if (data.dataType === 'source' && data.isSourceLoaded && data.source.id === 'transportation-zones') {
      this.get('map').moveLayer('transportation-zones', 'bbls');
      this.get('map').off('data', this.get('moveTransportationZones'));
    }
  },

  actions: {
    handleMapLoad(map) {
      this.set('map', map);
      this.get('map').on('data', this.get('moveTransportationZones').bind(this))
      
      window.map = map;
    }
  }
});
