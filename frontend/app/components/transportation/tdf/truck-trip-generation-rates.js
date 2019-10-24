import Component from '@ember/component';
import { alias } from '@ember-decorators/object/computed';

export default class TransportationTdfTruckTripGenerationRatesComponent extends Component {
  classNames = ["row"];

  @alias('factor.defaults.truckTripGenerationRates') data;
}
