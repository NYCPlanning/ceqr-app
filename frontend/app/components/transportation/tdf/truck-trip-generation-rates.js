import Component from '@ember/component';
import { alias } from '@ember/object/computed';

export default class TransportationTdfTruckTripGenerationRatesComponent extends Component {
  classNames = ['row'];

  @alias('factor.defaults.truckTripGenerationRates') data;
}
