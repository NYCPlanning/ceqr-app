import Component from '@ember/component';
import mapboxgl from 'mapbox-gl';
import centroid from '@turf/centroid';

export default Component.extend({
  map: null,

  didReceiveAttrs() {
    this._super(...arguments);

    this.set('zonePopup', new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    }));
  },

  moveTransportationZones(data) {
    if (data.dataType === 'source' && data.isSourceLoaded && data.source.id === 'transportation-zones') {
      this.map.moveLayer('transportation-zones', 'bbls');
      this.map.off('data', this.moveTransportationZones);
    }
  },

  actions: {
    zoneHover(e) {
      this.map.getCanvas().style.cursor = 'default';

      this.zonePopup
        .setLngLat(e.lngLat)
        .setHTML(`<div class="traffic-zone-popup">
          Traffic Zone <div class="ui grey circular label">${e.features[0].properties.zone}</div>
        </div>`)
        .addTo(this.map);
    },

    zoneUnhover() {
      this.map.getCanvas().style.cursor = '';
      this.zonePopup.remove();
    },

    handleMapLoad(map) {
      map.addControl(new mapboxgl.ScaleControl({ unit: 'imperial' }), 'bottom-right');
      map.on('data', this.moveTransportationZones.bind(this));
      map.flyTo({
        center: centroid(this.project.get('bblsGeojson.features.firstObject')).geometry.coordinates,
        zoom: 14,
      });

      this.set('map', map);
    },
  },
});
