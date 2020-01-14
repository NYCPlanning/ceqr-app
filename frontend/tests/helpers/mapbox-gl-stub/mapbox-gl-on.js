import Component from '@ember/component';

// stub for mapbox-gl-on, the ember-mapbox-gl interface for binding events
export default class MapboxOn extends Component {
  // tagName = '';

  // this component gets "positional params" so that it can be invoked as follows:
  // {{map.on 'someEvent' (action 'myAction')}}
  static positionalParams = ['event', 'optionalLayerId', 'action'];

  // the core functionality of mapbox-gl-on is handled on init by binding
  // the passed event name with the passed action.
  init(...args) {
    super.init(...args);

    // the component allows for an optional id to be passed as the second argument.
    // if it's not passed, we have to make sure the action gets set correctly
    if (!this.action) this.action = this.optionalLayerId;

    this.eventSource.on(this.event, this.action);
  }

  // see mapbox-gl stub class - the layout hands a reference to itself down
  eventSource;
}
