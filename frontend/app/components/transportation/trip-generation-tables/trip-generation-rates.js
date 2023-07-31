import Component from '@ember/component';
import { action } from '@ember/object';

export default class TransportationTripGenerationTablesTripGenerationRatesComponent extends Component {
  tagName = '';
  // The project's transportation analysis object.
  // Must be passed from parent component.
  analysis = {};

  /**
   * @param {string} time - either "am", "md", "pm" or "saturday"
   * @param {string} inOut - either "in" or "out"
   */
  @action
  setInOutDist(time, inOut) {
    const dists = this.analysis.inOutDists;
    if (dists[time][inOut] > 100) {
      this.analysis.set(`inOutDists.${time}.${inOut}`, 100);
    }
    if (dists[time][inOut] < 0) {
      this.analysis.set(`inOutDists.${time}.${inOut}`, 0);
    }
    const oppositeDir = inOut == 'in' ? 'out' : 'in';
    this.analysis.set(
      `inOutDists.${time}.${oppositeDir}`,
      100 - dists[time][inOut]
    );
    this.analysis.save();
  }
}
