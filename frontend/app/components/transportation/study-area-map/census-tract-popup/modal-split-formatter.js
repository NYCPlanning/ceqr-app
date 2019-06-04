import Component from '@ember/component';
import { computed } from '@ember-decorators/object';

/**
 * ModalSplitFormatter component is responsible for correctly ingesting census-tract records
 * and formatting the data for display. Due to the data model, multiple records are required
 * to get the full data for a single census tract, and must be rendered correctly depending on
 * which variable a single record is for. For variable = "population", the data is presented separately.
 * All other variables are displayed in a table (see template for structure)
 */
export default class TransportationStudyAreaMapCensusTractPopupModalSplitFormatterComponent extends Component {
  /**
   * RecordArray from census-tract-popup/data containing census-tract models for a given geoid
   */
  data = [];

  /**
   *  The 'value' property of the census-tract record for variable = 'population'
   */
  @computed('data')
  get population() {
    const data = this.get('data');
    const populationVariable = data.filter((censusTractVariable) => {return censusTractVariable.variable === 'population'})[0];
    return populationVariable ? populationVariable.value : 'Unknown';
  }

  /**
   * The census-tract records for modal split variables
   * (i.e. trans_total, trans_auto_total, trans_public_total)
   */
  @computed('data')
  get modalSplitData() {
    const data = this.get('data');
    return data.filter((censusTractVariable) => { return censusTractVariable.variable !== 'population' });
  }

}
