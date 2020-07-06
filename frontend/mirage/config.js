import JWT from 'jsonwebtoken';
import ENV from 'labs-ceqr/config/environment';
import cartoresponses from './fixtures/cartoresponses';
import cartoMap from './fixtures/carto-map';
import dummyMapboxStyle from './fixtures/dummy-mapbox-style';
import patchXMLHTTPRequest from './helpers/mirage-mapbox-gl-monkeypatch';

const secret = 'nevershareyoursecret';

export default function() {
  patchXMLHTTPRequest();
  /**
   *
   * Passthroughs
   *
   */
  this.passthrough('/data-tables/**');
  this.passthrough('/ceqr-manual/**');
  this.passthrough('https://api.mapbox.com/**');
  this.passthrough('https://layers-api.planninglabs.nyc/**');
  this.passthrough('https://tiles.planninglabs.nyc/**');
  this.passthrough('https://events.mapbox.com/events/**');
  this.passthrough('https://edm-publishing.nyc3.digitaloceanspaces.com/ceqr-app-data/**');

  this.passthrough('https://cartocdn-gusc-a.global.ssl.fastly.net/planninglabs/**');
  this.passthrough('https://cartocdn-gusc-b.global.ssl.fastly.net/planninglabs/**');
  this.passthrough('https://cartocdn-gusc-c.global.ssl.fastly.net/planninglabs/**');
  this.passthrough('https://cartocdn-gusc-d.global.ssl.fastly.net/planninglabs/**');
  this.passthrough('https://js-agent.newrelic.com/**');

  // related to ember-cli-code-coverage. required to be open to report back findings
  this.passthrough('/write-coverage');

  // CartoVL map
  this.post('https://planninglabs.carto.com/api/v1/map', function() {
    return cartoMap;
  });

  this.get('https://layers-api.planninglabs.nyc/v1/base/style.json', function() {
    return dummyMapboxStyle;
  });

  /**
   *
   * Carto Data
   *
   */
  this.get(`https://${ENV.carto.domain}/**`, function(schema, request) {
    const { response: { content: { text } } } = cartoresponses.log.entries.find((entry) => {
      // decode encoded uri so it's less noisy. trim it, then extract the columns
      const recordedResponseUrl = decodeURI(entry.request.url).trim().match(/select[\s\S]*?from/i)[0];
      // replace new lines and breaks, trim, and extract columns
      const fakeRequestUrl = request.url.replace(/(\r\n|\n|\r)/gm, '').trim().match(/select[\s\S]*?from/i)[0];

      return recordedResponseUrl === fakeRequestUrl;
    });

    return JSON.parse(text);
  });

  this.urlPrefix = `${ENV.host}`;
  /**
   *
   * Users/Auth
   *
   */
  this.post('/auth/v1/login', function() {
    const token = JWT.sign({ user_id: 1, email: 'me@me.com' }, secret);

    return {
      token,
    };
  });


  /**
   *
   * BBLs
   *
   */
  this.get('/ceqr_data/v1/mappluto/validate/:bbl', function() {
    return {
      valid: true,
    };
  });

  // everything after this is scoped to this namespace
  this.namespace = '/api/v1';
  this.get('/users/:id');
  this.get('/data-packages');
  this.get('/data-packages/:id');

  /**
   *
   * Projects
   *
  }
   */
  this.get('/projects');
  this.get('/projects/:id');
  this.post('/projects', function(schema) {
    const attrs = this.normalizedRequestAttrs();

    attrs.borough = 'Manhattan';

    const project = schema.projects.create(attrs);
    project.createPublicSchoolsAnalysis({
      project,
      multipliers: {
        version: 'november-2018',
        districts: [
          {
            hs: 0.02,
            is: 0.03,
            ps: 0.05,
            csd: 1,
            borocode: 'mn',
            hsThreshold: 7126,
            psisThreshold: 630,
          },
          {
            hs: 0.02,
            is: 0.02,
            ps: 0.05,
            csd: 2,
            borocode: 'mn',
            hsThreshold: 7126,
            psisThreshold: 725,
          },
          {
            hs: 0.02,
            is: 0.03,
            ps: 0.06,
            csd: 3,
            borocode: 'mn',
            hsThreshold: 7126,
            psisThreshold: 569,
          },
          {
            hs: 0.02,
            is: 0.05,
            ps: 0.13,
            csd: 4,
            borocode: 'mn',
            hsThreshold: 7126,
            psisThreshold: 292,
          },
          {
            hs: 0.02,
            is: 0.06,
            ps: 0.16,
            csd: 5,
            borocode: 'mn',
            hsThreshold: 7126,
            psisThreshold: 225,
          },
          {
            hs: 0.02,
            is: 0.06,
            ps: 0.15,
            csd: 6,
            borocode: 'mn',
            hsThreshold: 7126,
            psisThreshold: 242,
          },
        ],
        thresholdHsStudents: 150,
        thresholdPsIsStudents: 50,
      },
      subdistrictsFromDb: [
        {
          district: 1,
          subdistrict: 2,
        },
      ],
    });

    window.project = project;

    project.save();

    return project;
  });
  this.patch('/projects');
  this.patch('/projects/:id');

  /**
   *
   * Analyses
   *
   */
  this.get('public-schools-analyses/:id');
  this.patch('public-schools-analyses/:id');

  this.get('transportation-analyses');
  this.get('transportation-analyses/:id');
  this.patch('transportation-analyses/:id');

  this.get('transportation-planning-factors');
  this.get('transportation-planning-factors/:id');
  this.post('transportation-planning-factors');
  this.patch('transportation-planning-factors/:id');
}
