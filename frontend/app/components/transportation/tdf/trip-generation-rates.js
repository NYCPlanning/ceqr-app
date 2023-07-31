import Component from '@ember/component';
import { alias } from '@ember/object/computed';

export default class TransportationTdfTripGenerationRatesComponent extends Component {
  tagName = '';
  classNames = ['row'];

  @alias('factor.defaults.tripGenerationRates') data;
}
