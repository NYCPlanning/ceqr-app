import JWT from 'jsonwebtoken';
import ENV from 'labs-ceqr/config/environment';
import cartoresponses from './fixtures/cartoresponses';

const secret = 'nevershareyoursecret';

export default function() {
  // allow all static requests
  this.passthrough('/data-tables/**');
  this.passthrough('/ceqr-manual/**');

  // Carto requests
  this.get(`https://${ENV.carto['domain']}/**`, function(schema, request) {
    const { response: { content: { text } } } = cartoresponses.log.entries.find((entry) => {
      // decode encoded uri so it's less noisy. trim it, then extract the columns
      const recordedResponseUrl = decodeURI(entry.request.url).trim().match(/select[\s\S]*?from/i)[0];
      // replace new lines and breaks, trim, and extract columns
      const fakeRequestUrl = request.url.replace(/(\r\n|\n|\r)/gm, "").trim().match(/select[\s\S]*?from/i)[0];

      return recordedResponseUrl === fakeRequestUrl;
    });

    return JSON.parse(text);
  });

  this.post('/auth/v1/login', function() {
    const token = JWT.sign({ id: 1, user: 'me@me.com' }, secret);

    return {
      token,
    };
  });

  this.namespace = 'api/v1';

  this.get('projects');
  this.get('projects/:id');

  this.post('projects', function(schema) {
    const attrs = this.normalizedRequestAttrs();

    attrs.borough = 'Manhattan';

    const project = schema.projects.create(attrs);
    project.createPublicSchoolsAnalysis({ project });
    project.save();

    return project;
  });

  this.patch('projects');

  this.patch('public-schools-analyses/:id');

  this.get('bbls');

  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */

  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.namespace = '';    // make this `/api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  /*
    Shorthand cheatsheet:

    this.get('/posts');
    this.post('/posts');
    this.get('/posts/:id');
    this.put('/posts/:id'); // or this.patch
    this.del('/posts/:id');

    http://www.ember-cli-mirage.com/docs/v0.4.x/shorthands/
  */
}
