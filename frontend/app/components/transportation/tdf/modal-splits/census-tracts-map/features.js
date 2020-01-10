import Component from '@ember/component';

export default class TransportationCensusTractsMapFeaturesComponent extends Component {
  /**
   * Flag for optionally displaying transit zones
   */
  showTransitZones = false;

  /**
   * Flag for optionally displaying land use
   */
  showLandUse = false;

  /**
   * Lookup hash of descriptions for land use types for map legend
   */
  landUseDescriptionsLookup = {
    '01': '1 & 2 Family',
    '02': 'Multifamily Walk-up',
    '03': 'Multifamily Elevator',
    '04': 'Mixed Res. & Commercial',
    '05': 'Commercial & Office',
    '06': 'Industrial & Manufacturing',
    '07': 'Transportation & Utility',
    '08': 'Public Facilities & Institutions',
    '09': 'Open Space & Outdoor Recreation',
    10: 'Parking Facilities',
    11: 'Vacant Land',
    '00': 'Other',
  };
}
