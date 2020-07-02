import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import fetch from 'fetch';

export default class DataAirQualityRoute extends Route {
  async model() {
    const data_dir = 'https://edm-publishing.nyc3.digitaloceanspaces.com/ceqr-app-data/';

    const fetchOptions = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/text',
      },
    };

    const dep = await fetch(`${data_dir}dep_cats_permits/latest/version.txt`, fetchOptions);
    const nysdec = await fetch(`${data_dir}nysdec_state_facility_permits/latest/version.txt`, fetchOptions);
    const title_v = await fetch(`${data_dir}nysdec_title_v_facility_permits/latest/version.txt`, fetchOptions);

    const dep_date = dep.text();
    const nysdec_date = nysdec.text();
    const title_v_date = title_v.text();

    return RSVP.hash({
      dep_updated_on: dep.ok ? dep_date : null,
      nysdec_updated_on: nysdec.ok ? nysdec_date : null,
      title_v_updated_on: title_v.ok ? title_v_date : null,
    });
  }
}
