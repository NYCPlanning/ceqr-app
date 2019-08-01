import Service from '@ember/service';
import fetch from 'fetch';
import ENV from 'labs-ceqr/config/environment';

export default class CeqrDataService extends Service {
  async valid_bbl(bbl, version) {
    const response = await fetch(`${ENV.host}/ceqr_data/v1/mappluto/validate/${bbl}?version=${version}`, {
      method: 'GET'
    });

    const body = await response.json();

    return body.valid;
  }
}
