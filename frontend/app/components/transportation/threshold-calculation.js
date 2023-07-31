import Component from '@ember/component';
import { computed } from '@ember/object';
import round from '../../utils/round';

export default class TransportationThresholdCalculationComponent extends Component {
  tagName = '';
  @computed('analysis.{detailedAnalysis,sumOfRatios}')
  get detailedAnalysisPopupText() {
    return `Total Sum of Ratios is above 1 (at ${round(
      this.analysis.sumOfRatios,
      2
    )}), 
      triggering a preliminary trip generation analysis.`;
  }

  @computed('analysis.trafficZone')
  get residentialThreshold() {
    return this.analysis.thresholdFor('residentialUnits');
  }

  @computed('analysis.trafficZone')
  get officeThreshold() {
    return this.analysis.thresholdFor('officeSqFt');
  }

  @computed('analysis.trafficZone')
  get regionalRetailThreshold() {
    return this.analysis.thresholdFor('regionalRetailSqFt');
  }

  @computed('analysis.trafficZone')
  get localRetailThreshold() {
    return this.analysis.thresholdFor('localRetailSqFt');
  }

  @computed('analysis.trafficZone')
  get restaurantThreshold() {
    return this.analysis.thresholdFor('restaurantSqFt');
  }

  @computed('analysis.trafficZone')
  get communityFacilityThreshold() {
    return this.analysis.thresholdFor('communityFacilitySqFt');
  }

  @computed('analysis.trafficZone')
  get offStreetParkingThreshold() {
    return this.analysis.thresholdFor('offStreetParkingSpaces');
  }
}
