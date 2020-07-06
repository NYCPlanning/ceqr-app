import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import fetch from 'fetch';

export default class DataAirQualityRoute extends Route {
  async model() {
    const dataDir = 'https://edm-publishing.nyc3.digitaloceanspaces.com/ceqr-app-data/';
    const versionTxt = 'latest/version.txt';

    const fetchOptions = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/text',
      },
    };

    const depTxt = await fetch(`${dataDir}dep_cats_permits/${versionTxt}`, fetchOptions);
    const nysdecTxt = await fetch(`${dataDir}nysdec_state_facility_permits/${versionTxt}`, fetchOptions);
    const titleVTxt = await fetch(`${dataDir}nysdec_title_v_facility_permits/${versionTxt}`, fetchOptions);

    return RSVP.hash({
      depUpdatedOn: depTxt.ok ? depTxt.text() : null,
      nysdecUpdatedOn: nysdecTxt.ok ? nysdecTxt.text() : null,
      titleVUpdatedOn: titleVTxt.ok ? titleVTxt.text() : null,
    });
  }
}
