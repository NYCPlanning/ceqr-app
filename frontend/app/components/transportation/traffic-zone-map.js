import Component from '@ember/component';
import mapboxgl from 'mapbox-gl';
import centroid from '@turf/centroid';

export default Component.extend({
  map: null,

  didReceiveAttrs() {
    this._super(...arguments);

    this.set('zonePopup', new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    }));
  },

  moveTransportationZones: function(data) {
    if (data.dataType === 'source' && data.isSourceLoaded && data.source.id === 'transportation-zones') {
      this.get('map').moveLayer('transportation-zones', 'bbls');
      this.get('map').off('data', this.get('moveTransportationZones'));
    }
  },

  actions: {
    zoneHover(e) {
      this.get('map').getCanvas().style.cursor = 'default';

      this.get('zonePopup')
        .setLngLat(e.lngLat)
        .setHTML(`<div class="traffic-zone-popup">
          Traffic Zone <div class="ui grey circular label">${e.features[0].properties.zone}</div>
        </div>`)
        .addTo(this.get('map'));
    },
  
    zoneUnhover() {
      this.get('map').getCanvas().style.cursor = '';
      this.get('zonePopup').remove();
    },

    handleMapLoad(map) {
      map.addControl(new mapboxgl.ScaleControl({ unit: 'imperial' }), 'bottom-right');
      map.on('data', this.get('moveTransportationZones').bind(this));
      map.flyTo({
        center: centroid(this.project.get('bblsGeojson.features.firstObject')).geometry.coordinates,
        zoom: 14
      });

      this.set('map', map);      
    }
  }
});
