import Component from '@ember/component';
import { computed } from '@ember/object';
import { getAggregatePercent } from '../../../helpers/get-aggregate-percent';
import { getAggregateValue } from '../../../helpers/get-aggregate-value';


export default class TransportationTripGenerationTablesTripGenerationResultsComponent extends Component {
  // the Transportation Analysis model belonging to the Project model
  analysis = {}

  /**
   * @param {Object[]} -- Array of modal splits
  */
  selectedCensusTractData = []

  /**
   * @param {Object} -- Hash where mode variable codes are keys and  and human readable labels are values
  */
  modeLookup = {}

  /**
   * @param {string[]} -- items must correspond to one of the variable modes defined in
   * app/utils/VARIABLE_MODE_LOOKUP
  */
  modalSplitVariablesSubset = [];

  @computed('selectedCensusTractData', 'modalSplitVariablesSubset', 'modeLookup')
  get modeAggregatePercents() {
    const modeAggPercents = {};
    for (const mode of this.modalSplitVariablesSubset) {
      modeAggPercents[mode] = getAggregatePercent([this.selectedCensusTractData, [mode], false]) / 100;
    }
    return modeAggPercents;
  }

  /** PERSON TRIPS * */

  // trip gen result for given weekday time, direction and mode
  @computed('modeAggregatePercents', 'modalSplitVariablesSubset', 'analysis.{residentialUnits,dailyTripRate.weekday.rate,temporalDistributions.decimal,inOutDists}')
  get weekdayModeCalcs() {
    const ta = this.analysis;
    const weekdayModeCalcs = {
      am: { in: {}, out: {} },
      md: { in: {}, out: {} },
      pm: { in: {}, out: {} },
    };
    for (const time of ['am', 'md', 'pm']) {
      for (const inOut of ['in', 'out']) {
        for (const mode of this.modalSplitVariablesSubset) {
          weekdayModeCalcs[time][inOut][mode] = ta.residentialUnits
            * ta.dailyTripRate.weekday.rate
            * ta.temporalDistributions[time].decimal
            * (ta.inOutDists[time][inOut] / 100)
            * this.modeAggregatePercents[mode];
        }
      }
    }
    return weekdayModeCalcs;
  }

  // totals of trip gen results across modes for a given weekday/time/inOut
  @computed('weekdayModeCalcs', 'modalSplitVariablesSubset')
  get weekdayModesTotals() {
    const weekdayModesTotals = {
      am: { in: {}, out: {} },
      md: { in: {}, out: {} },
      pm: { in: {}, out: {} },
    };
    for (const time of ['am', 'md', 'pm']) {
      for (const inOut of ['in', 'out']) {
        weekdayModesTotals[time][inOut] = this.modalSplitVariablesSubset.reduce(
          (acc, mode) => acc += this.weekdayModeCalcs[time][inOut][mode], 0,
        );
      }
    }
    return weekdayModesTotals;
  }

  // per-mode weekday totals.
  // i.e. totals of trip gen results of both 'in' and 'out' directions for a given weekday time and mode
  @computed('weekdayModeCalcs', 'modalSplitVariablesSubset')
  get totalsOfWeekdayMode() {
    const totalsOfWeekdayMode = {
      am: {},
      md: {},
      pm: {},
    };
    for (const time of ['am', 'md', 'pm']) {
      for (const mode of this.modalSplitVariablesSubset) {
        totalsOfWeekdayMode[time][mode] = this.weekdayModeCalcs[time].in[mode]
          + this.weekdayModeCalcs[time].out[mode];
      }
    }
    return totalsOfWeekdayMode;
  }

  // total of trip gen results  across per-mode totals for a given weekday time
  @computed('totalsOfWeekdayMode', 'modalSplitVariablesSubset')
  get totalsOfTotalsOfWeekdayMode() {
    const totalsOfTotalsOfWeekdayMode = {
      am: null,
      md: null,
      pm: null,
    };
    for (const time of ['am', 'md', 'pm']) {
      totalsOfTotalsOfWeekdayMode[time] = this.modalSplitVariablesSubset.reduce(
        (acc, mode) => acc += this.totalsOfWeekdayMode[time][mode], 0,
      );
    }
    return totalsOfTotalsOfWeekdayMode;
  }

  @computed('modeAggregatePercents', 'modalSplitVariablesSubset', 'analysis.{residentialUnits,dailyTripRate.saturday.rate,temporalDistributions.decimal,inOutDists}')
  get saturdayModeCalcs() {
    const ta = this.analysis;
    const saturdayModeCalcs = {
      in: {}, out: {},
    };
    for (const inOut of ['in', 'out']) {
      for (const mode of this.modalSplitVariablesSubset) {
        saturdayModeCalcs[inOut][mode] = ta.residentialUnits
            * ta.dailyTripRate.saturday.rate
            * ta.temporalDistributions.saturday.decimal
            * (ta.inOutDists.saturday[inOut] / 100)
            * this.modeAggregatePercents[mode];
      }
    }
    return saturdayModeCalcs;
  }

  // totals of trip gen results across modes for a given saturday time/inOut
  @computed('saturdayModeCalcs', 'modalSplitVariablesSubset')
  get saturdayModesTotals() {
    const saturdayModesTotals = {
      in: {}, out: {},
    };
    for (const inOut of ['in', 'out']) {
      saturdayModesTotals[inOut] = this.modalSplitVariablesSubset.reduce(
        (acc, mode) => acc += this.saturdayModeCalcs[inOut][mode], 0,
      );
    }
    return saturdayModesTotals;
  }

  // per-mode saturday totals.
  // i.e. total of both 'in' and 'out' directions for a given saturday and mode
  @computed('saturdayModeCalcs', 'modalSplitVariablesSubset')
  get totalsOfSaturdayMode() {
    const totalsOfSaturdayMode = {
      // keys of all modes in this.modalSplitVariablesSubset
    };
    for (const mode of this.modalSplitVariablesSubset) {
      totalsOfSaturdayMode[mode] = this.saturdayModeCalcs.in[mode]
        + this.saturdayModeCalcs.out[mode];
    }
    return totalsOfSaturdayMode;
  }

  // total of trip gen results across per-mode totals for Saturday
  @computed('totalsOfSaturdayMode')
  get totalOfTotalsOfSaturdayMode() {
    return this.modalSplitVariablesSubset.reduce(
      (acc, mode) => acc += this.totalsOfSaturdayMode[mode], 0,
    );
  }

  /** VEHICLE TRIPS * */

  @computed('selectedCensusTractData')
  get vehicleOccupancy() {
    if (this.selectedCensusTractData) {
      return getAggregateValue([this.selectedCensusTractData, ['vehicle_occupancy']]) / this.selectedCensusTractData.length;
    }
    return null;
  }

  @computed('weekdayModeCalcs', 'vehicleOccupancy')
  get weekdayAutoVehicleTripCalcs() {
    const weekdayAutoVehicleTripCalcs = {
      am: { in: {}, out: {} },
      md: { in: {}, out: {} },
      pm: { in: {}, out: {} },
    };
    for (const time of ['am', 'md', 'pm']) {
      for (const inOut of ['in', 'out']) {
        if (!isNaN(this.weekdayModeCalcs[time][inOut].trans_auto_total)) {
          weekdayAutoVehicleTripCalcs[time][inOut] = this.weekdayModeCalcs[time][inOut].trans_auto_total / this.vehicleOccupancy;
        }
      }
    }
    return weekdayAutoVehicleTripCalcs;
  }

  @computed('weekdayModeCalcs', 'analysis.taxiVehicleOccupancy')
  get weekdayTaxiVehicleTripCalcs() {
    if (this.analysis.taxiVehicleOccupancy) {
      const weekdayTaxiVehicleTripCalcs = {
        am: { in: null, out: null },
        md: { in: null, out: null },
        pm: { in: null, out: null },
      };
      for (const time of ['am', 'md', 'pm']) {
        for (const inOut of ['in', 'out']) {
          if (!isNaN(this.weekdayModeCalcs[time][inOut].trans_taxi)) {
            weekdayTaxiVehicleTripCalcs[time][inOut] = this.weekdayModeCalcs[time][inOut].trans_taxi / this.analysis.taxiVehicleOccupancy;
          }
        }
      }
      return weekdayTaxiVehicleTripCalcs;
    }
    return null;
  }

  @computed('weekdayAutoVehicleTripCalcs', 'weekdayTaxiVehicleTripCalcs', 'analysis.taxiVehicleOccupancy')
  get weekdayVehicleTripTotals() {
    if (this.analysis.taxiVehicleOccupancy) {
      const weekdayVehicleTripTotals = {
        am: { in: {}, out: {} },
        md: { in: {}, out: {} },
        pm: { in: {}, out: {} },
      };
      for (const time of ['am', 'md', 'pm']) {
        for (const inOut of ['in', 'out']) {
          weekdayVehicleTripTotals[time][inOut] = this.weekdayAutoVehicleTripCalcs[time][inOut]
            + this.weekdayTaxiVehicleTripCalcs[time][inOut];
        }
      }
      return weekdayVehicleTripTotals;
    }
    return null;
  }

  @computed('weekdayAutoVehicleTripCalcs')
  get totalsOfWeekdayAutoVehicleTrip() {
    const totalsOfWeekdayAutoVehicleTrip = {
      am: null,
      md: null,
      pm: null,
    };
    for (const time of ['am', 'md', 'pm']) {
      totalsOfWeekdayAutoVehicleTrip[time] = this.weekdayAutoVehicleTripCalcs[time].in
      + this.weekdayAutoVehicleTripCalcs[time].out;
    }
    return totalsOfWeekdayAutoVehicleTrip;
  }

  @computed('weekdayTaxiVehicleTripCalcs')
  get totalsOfWeekdayTaxiVehicleTrip() {
    if (this.analysis.taxiVehicleOccupancy) {
      const totalsOfWeekdayTaxiVehicleTrip = {
        am: null,
        md: null,
        pm: null,
      };
      for (const time of ['am', 'md', 'pm']) {
        totalsOfWeekdayTaxiVehicleTrip[time] = this.weekdayTaxiVehicleTripCalcs[time].in
        + this.weekdayTaxiVehicleTripCalcs[time].out;
      }
      return totalsOfWeekdayTaxiVehicleTrip;
    }
    return null;
  }

  @computed('totalsOfWeekdayAutoVehicleTrip', 'totalsOfWeekdayTaxiVehicleTrip', 'analysis.taxiVehicleOccupancy')
  get totalsOfTotalsOfWeekdayVehicleTrip() {
    if (this.analysis.taxiVehicleOccupancy) {
      const totalsOfTotalsOfWeekdayVehicleTrip = {
        am: null,
        md: null,
        pm: null,
      };
      for (const time of ['am', 'md', 'pm']) {
        totalsOfTotalsOfWeekdayVehicleTrip[time] = this.totalsOfWeekdayAutoVehicleTrip[time]
          + this.totalsOfWeekdayTaxiVehicleTrip[time];
      }
      return totalsOfTotalsOfWeekdayVehicleTrip;
    }
    return null;
  }

  @computed('saturdayModeCalcs', 'vehicleOccupancy')
  get saturdayAutoVehicleTripCalcs() {
    const saturdayAutoVehicleTripCalcs = {
      in: null,
      out: null,
    };
    for (const inOut of ['in', 'out']) {
      if (!isNaN(this.saturdayModeCalcs[inOut].trans_auto_total)) {
        saturdayAutoVehicleTripCalcs[inOut] = this.saturdayModeCalcs[inOut].trans_auto_total / this.vehicleOccupancy;
      }
    }
    return saturdayAutoVehicleTripCalcs;
  }

  @computed('saturdayModeCalcs', 'analysis.taxiVehicleOccupancy')
  get saturdayTaxiVehicleTripCalcs() {
    if (this.analysis.taxiVehicleOccupancy) {
      const saturdayTaxiVehicleTripCalcs = {
        in: null,
        out: null,
      };
      for (const inOut of ['in', 'out']) {
        if (!isNaN(this.saturdayModeCalcs[inOut].trans_taxi)) {
          saturdayTaxiVehicleTripCalcs[inOut] = this.saturdayModeCalcs[inOut].trans_taxi / this.analysis.taxiVehicleOccupancy;
        }
      }
      return saturdayTaxiVehicleTripCalcs;
    }
    return null;
  }

  @computed('saturdayAutoVehicleTripCalcs', 'saturdayTaxiVehicleTripCalcs', 'analysis.taxiVehicleOccupancy')
  get saturdayVehicleTripTotals() {
    if (this.analysis.taxiVehicleOccupancy) {
      const saturdayVehicleTripTotals = {
        in: {}, out: {},
      };
      for (const inOut of ['in', 'out']) {
        saturdayVehicleTripTotals[inOut] = this.saturdayAutoVehicleTripCalcs[inOut]
          + this.saturdayTaxiVehicleTripCalcs[inOut];
      }
      return saturdayVehicleTripTotals;
    }
    return null;
  }

  @computed('saturdayAutoVehicleTripCalcs')
  get totalOfSaturdayAutoVehicleTrip() {
    return this.saturdayAutoVehicleTripCalcs.in + this.saturdayAutoVehicleTripCalcs.out;
  }

  @computed('saturdayTaxiVehicleTripCalcs')
  get totalOfSaturdayTaxiVehicleTrip() {
    if (this.analysis.taxiVehicleOccupancy) {
      return this.saturdayTaxiVehicleTripCalcs.in + this.saturdayTaxiVehicleTripCalcs.out;
    }
    return null;
  }

  @computed('totalOfSaturdayAutoVehicleTrip', 'totalOfSaturdayTaxiVehicleTrip')
  get totalOfTotalsOfSaturdayVehicleTrip() {
    if (this.totalOfSaturdayTaxiVehicleTrip) {
      return this.totalOfSaturdayAutoVehicleTrip + this.totalOfSaturdayTaxiVehicleTrip;
    }
    return null;
  }
}
