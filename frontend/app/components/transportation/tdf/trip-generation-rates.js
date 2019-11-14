import Component from '@ember/component';
import { alias } from '@ember-decorators/object/computed';

export default class TransportationTdfTripGenerationRatesComponent extends Component {
  classNames = ["row"];

  @alias('factor.defaults.tripGenerationRates') data;
}
