import Component from '@ember/component';
import { computed, action, set } from '@ember/object';
import mapboxgl from 'mapbox-gl';
import bbox from '@turf/bbox';
import buffer from '@turf/buffer';

/**
 * Helper function to ensure 'bbls' layer is the top-most layer. MapboxGL styleIsLoaded() check,
 * and 'style.load' events do not reliably indicate a fully loaded style object.
 * To display 'bbls' as the top-most layer, must move it with moveLayer()
 */
const onMapStyleLoaded = function (e) {
  const { target: map } = e;
  const style = map.getStyle();
  if (style.sources.bbls_geojson && style.sources.carto) {
    map.moveLayer('bbls');
    map.off('data', onMapStyleLoaded);
  }
};

export default class ProjectProjectAreaSelectorMapComponent extends Component {
  tagName = '';
  hoveredFeatureId = null;

  @computed('project.bbls.[]')
  get selectedBbls() {
    return this.project.get('bbls').map((b) => parseFloat(b));
  }

  @computed('project.dataPackage')
  get mapplutoSql() {
    const cartoTable = this.project.get('dataPackage.schemas.mappluto.carto');
    return `SELECT the_geom, the_geom_webmercator, lot, bbl FROM ${cartoTable}`;
  }

  @action
  setFirstHoveredFeatureId(features) {
    if (features && features.length && features[0]) {
      set(this, 'hoveredFeatureId', features[0].properties.bbl);
    } else {
      set(this, 'hoveredFeatureId', null);
    }
  }

  @action
  mapLoaded(map) {
    console.info('project area selector map loaded', map);
    map.on('data', onMapStyleLoaded);

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    const projectGeojson = this.project.get('bblsGeojson');
    if (projectGeojson) {
      map.fitBounds(bbox(buffer(projectGeojson, 0.1, { units: 'kilometers' })));
    }
  }
}
