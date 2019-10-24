import EmberObject from '@ember/object';
import { computed } from '@ember-decorators/object';

/**
 * TransportationTdfCalculator is an EmberObject that calculates Trip Results for given inputs.
 *
 * @constructor
 * @param {string} landUse
 * @param {integer} units
 * @param {object} project - an array of all mode ids 
 * @param {array} modes - array of modes to be analyzed
 * @param {object} modeSplits
 * @param {object} inOutSplits
 * @param {object} truckInOutSplits
 * @param {object} vehicleOccupancy
 */

export default class TransportationTripResultsCalculator extends EmberObject {
  @computed('units', 'defaults')
  get normalizedUnits() {
    return Math.round(this.units / this.defaults.tripGenRatePerUnit);
  }

  // Returns an object whose keys are temporal types
  @computed('defaults')
  get personTrips() {
    let results = {
      am: {},
      md: {},
      pm: {},
      saturday: {}
    };

    ["am", "md", "pm", "saturday"].forEach((temporalId) => {
      let personTrips;
      if (temporalId === "saturday") {
        personTrips = Math.round(this.normalizedUnits * this.defaults.tripGenerationRates.saturday.rate);
      } else {
        personTrips = Math.round(this.normalizedUnits * this.defaults.tripGenerationRates.weekday.rate);
      }

      const totalTrips = Math.round(personTrips * this.defaults.temporalDistribution[temporalId].percent);
      const totalIn    = Math.round(totalTrips * (parseInt(this.inOutSplits[temporalId].in) / 100));
      const totalOut   = Math.round(totalTrips * (parseInt(this.inOutSplits[temporalId].out) / 100));
      
      results[temporalId]["allModesTotal"] = {
        in:    totalIn,
        out:   totalOut,
        total: totalTrips,
      }

      results[temporalId]["total"] = {
        in:    0,
        out:   0,
        total: 0
      };

      this.modes.forEach((mode) => {
        const modeSplit = (parseInt(this.modeSplits[mode].allPeriods) / 100);
        // Per mode
        const modeIn   = Math.round(modeSplit * totalIn);
        const modeOut   = Math.round(modeSplit * totalOut);
        const modeTotal = modeIn + modeOut;

        results[temporalId]["total"].in    = modeIn    + results[temporalId]["total"].in;
        results[temporalId]["total"].out   = modeOut   + results[temporalId]["total"].out;
        results[temporalId]["total"].total = modeTotal + results[temporalId]["total"].total;

        results[temporalId][mode] = { 
          in:    modeIn, 
          out:   modeOut,
          total: modeTotal
        }
      });
    });

    return results;
  }

  @computed('personTrips')
  get vehicleTrips() {
    let results = {
      am: {},
      md: {},
      pm: {},
      saturday: {}
    };

    ["am", "md", "pm", "saturday"].forEach((temporalId) => {
      let truckTrips;
      if (temporalId === "saturday") {
        truckTrips = Math.round(this.normalizedUnits * this.defaults.truckTripGenerationRates.saturday.rate);
      } else {
        truckTrips = Math.round(this.normalizedUnits * this.defaults.truckTripGenerationRates.weekday.rate);
      }

      const truckIn = Math.round(
        truckTrips *
        (parseInt(this.truckInOutSplits.allDay.in)  / 100) *
        this.defaults.truckTemporalDistribution[temporalId].percent
      );
      const truckOut = Math.round(
        truckTrips *
        (parseInt(this.truckInOutSplits.allDay.out) / 100) *
        this.defaults.truckTemporalDistribution[temporalId].percent
      );
      const truckTotal = truckIn + truckOut;
      
      results[temporalId]["truck"] = {
        in:    truckIn,
        out:   truckOut,
        total: truckTotal
      }

      results[temporalId]["total"] = {
        in:    truckIn,
        out:   truckOut,
        total: truckTotal
      };
      
      ["auto", "taxi"].forEach((mode) => {
        if (!this.modes.includes(mode)) return;
        
        const modeIn    = Math.round(this.personTrips[temporalId][mode].in   / this.vehicleOccupancy[mode].allPeriods);
        const modeOut   = Math.round(this.personTrips[temporalId][mode].out  / this.vehicleOccupancy[mode].allPeriods);
        const modeTotal = modeIn + modeOut; 

        results[temporalId]["total"].in    = modeIn    + results[temporalId]["total"].in;
        results[temporalId]["total"].out   = modeOut   + results[temporalId]["total"].out;
        results[temporalId]["total"].total = modeTotal + results[temporalId]["total"].total;

        results[temporalId][mode] = { 
          in:    modeIn, 
          out:   modeOut,
          total: modeTotal
        }
      });
    });

    return results;
  }

  @computed('units', 'landUse')
  get defaults() {
    if (this.landUse === 'residential') {
      return {
        units: this.units, // should remove
        unitName: 'DU',
        tripGenRatePerUnit: 1,
        tripGenerationRates: {
          weekday:  {label: "Weekday",  rate: 8.075 },
          saturday: {label: "Saturday", rate: 9.6 },
          source: "2014 CEQR Technical Manual"
        },
        truckTripGenerationRates: {
          weekday:  {label: "Weekday",  rate: 0.06 },
          saturday: {label: "Saturday", rate: 0.02 }
        },
        temporalDistribution: {
          am:       {label: "AM",       percent: .10 },
          md:       {label: "Midday",   percent: .05 },
          pm:       {label: "PM",       percent: .11 },
          saturday: {label: "Saturday", percent: .08 }
        },
        truckTemporalDistribution: {
          am:       {label: "AM",       percent: .12 },
          md:       {label: "Midday",   percent: .09 },
          pm:       {label: "PM",       percent: .02 },
          saturday: {label: "Saturday", percent: .09 }
        }
      };
    }

    if (this.landUse === 'office') {
      return {
        units: this.units, // should remove
        unitName: 'sq ft',
        tripGenRatePerUnit: 1000,
        tripGenerationRates: {
          weekday:  {label: "Weekday",  rate: 18 },
          saturday: {label: "Saturday", rate: 3.9 }
        },
        truckTripGenerationRates: {
          weekday:  {label: "Weekday",  rate: 0.32 },
          saturday: {label: "Saturday", rate: 0.01 }
        },
        temporalDistribution: {
          am:       {label: "AM",       percent: .12 },
          md:       {label: "Midday",   percent: .15 },
          pm:       {label: "PM",       percent: .14 },
          saturday: {label: "Saturday", percent: .17 }
        },
        truckTemporalDistribution: {
          am:       {label: "AM",       percent: .10 },
          md:       {label: "Midday",   percent: .11 },
          pm:       {label: "PM",       percent: .02 },
          saturday: {label: "Saturday", percent: .11 }
        }
      };
    }

    return {};
  }
}
