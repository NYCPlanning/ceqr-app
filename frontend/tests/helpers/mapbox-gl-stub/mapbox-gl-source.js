import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';

export default class MapboxGlSource extends Component {
  layout = hbs`
    {{yield (hash
      layer = (component 'mapbox-gl-layer')
    )}}
  `;
}
