import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';
import { defaultMapboxEventStub } from './default-mapbox-api-surface';

// define a new mapbox-gl class with the layout also stubbed in.
// this will replace the ember-mapbox-gl bindings during tests
export default class MapboxGl extends Component {
  mapLoaded = () => {}

  // classNames = 'mapbox-gl';

  // current test context, used to contain reference to
  // test scope for dependency injections & stubbing
  // mapbox-gl methods
  mapboxEventStub = defaultMapboxEventStub;

  init(...args) {
    // mapLoaded is an ember-mapbox-gl convenience
    // which specifically sends out the "target"
    // as the map instance
    this.map = this.mapboxEventStub.mapInstance;
    this.mapLoaded(this.map);

    super.init(...args);
  }

  // this is a layout stub which is necessary to replace contextual components
  // that descend from {{mapbox-gl}}
  // as more ember-mapbox-gl contextual components are needed for stubbing,
  // they must be added here
  layout = hbs`
    {{!-- Highlighted Layer Handling --}}
    {{yield (assign 
      (hash
        on=(component 'mapbox-gl-on'
          eventSource=this.mapboxEventStub.mapInstance
        )
        source=(component 'mapbox-gl-source'
          map=this.map
        )
        layer=(component 'mapbox-gl-layer'
          map=this.map
        )
        draw=this.mapboxEventStub.draw
        mapInstance=this.mapboxEventStub.mapInstance
      )
      this.mapboxEventStub
    )}}
  `;
}
