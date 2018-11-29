import DS from 'ember-data';

const { JSONAPISerializer } = DS;

export default class ApplicationSerializer extends JSONAPISerializer {
  attrs = {
    created_at: { serialize: false },
    updated_at: { serialize: false },
    updated_by: { serialize: false }
  }
}