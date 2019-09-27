import DS from 'ember-data';
const { Model } = DS;
import { attr, belongsTo } from '@ember-decorators/data';

export default class TransportationPlanningFactorModel extends Model {
  @belongsTo transportationAnalysis;
  @belongsTo dataPackage;
  
  @attr('string') landUse;
  @attr({defaultValue: () => {}}) tableNotes;
  @attr({defaultValue: () => []}) modesForAnalysis;
  
  // Census tract variable data if landUse is residential or office
  @attr({defaultValue: () => []}) censusTractVariables;
  
  @attr('boolean') modeSplitsFromUser;
  @attr({defaultValue: () => {}}) modeSplits;
  // User-entered vehicle occupancy rate for "trip generation" existing conditions step
  @attr({defaultValue: () => {}}) vehicleOccupancy;

  // The percentage values for trip generation per-peak-hour In and Out trip distributions
  @attr({defaultValue: () => {}}) inOutSplits;
  @attr({defaultValue: () => {}}) truckInOutSplits;

  // TODO: needs updating
  // Function to be passed to data-package-selector component to update data package
  updateDataPackage = (dataPackage) => {
    switch (dataPackage.package) {
      case "nyc_acs":
        this.set('nycAcsDataPackage', dataPackage);  
        break;
      case "ctpp":
        this.set('ctppDataPackage', dataPackage);  
        break;
    }

    this.save();
  }
}
