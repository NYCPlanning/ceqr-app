import Component from '@ember/component';
import { alias } from '@ember/object/computed';

export default class TransportationTdfTripGenerationRatesComponent extends Component {
  classNames = ['row'];

  @alias('factor.defaults.tripGenerationRates') data;
}
