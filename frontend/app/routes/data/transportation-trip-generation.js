import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import fetch from 'fetch';

export default class DataTransportationTripGenerationRoute extends Route {
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

    const transportationFile = await fetch(`${dataDir}transportation/${versionTxt}`, fetchOptions);

    return RSVP.hash({
      transportationUpdatedOn: transportationFile.ok ? transportationFile.text() : null,
    });
  }
}
