import Component from '@ember/component';
import mapboxgl from 'mapbox-gl';
import centroid from '@turf/centroid';
import { action, set } from '@ember/object';

export default class TransportationTrafficZoneMapComponent extends Component {
  tagName = '';
  map = null;

  didReceiveAttrs() {
    super.didReceiveAttrs();
    super.didReceiveAttrs(...arguments);

    set(
      this,
      'zonePopup',
      new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      })
    );
  }

  moveTransportationZones(data) {
    if (
      data.dataType === 'source' &&
      data.isSourceLoaded &&
      data.source.id === 'transportation-zones'
    ) {
      this.map.moveLayer('transportation-zones', 'bbls');
      this.map.off('data', this.moveTransportationZones);
    }
  }

  @action
  zoneHover(e) {
    console.info('zoneHover', e);
    this.map.getCanvas().style.cursor = 'default';

    this.zonePopup
      .setLngLat(e.lngLat)
      .setHTML(
        `<div class="traffic-zone-popup">
          Traffic Zone <div class="ui grey circular label">${e.features[0].properties.zone}</div>
        </div>`
      )
      .addTo(this.map);
  }

  @action
  zoneUnhover() {
    this.map.getCanvas().style.cursor = '';
    this.zonePopup.remove();
  }

  @action
  handleMapLoad(map) {
    console.info('handleMapLoad', map);
    map.addControl(
      new mapboxgl.ScaleControl({ unit: 'imperial' }),
      'bottom-right'
    );
    map.on('data', this.moveTransportationZones.bind(this));
    map.flyTo({
      center: centroid(this.project.get('bblsGeojson.features.firstObject'))
        .geometry.coordinates,
      zoom: 14,
    });

    set(this, 'map', map);
  }
}
