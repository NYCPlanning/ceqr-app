self.deprecationWorkflow = self.deprecationWorkflow || {};

self.deprecationWorkflow.config = {
  workflow: [
    {
      handler: 'silence',
      matchId: 'ember-views.curly-components.jquery-element',
    },
    {
      handler: 'silence',
      matchId: 'ember-data:record-lifecycle-event-methods',
    },
    { handler: 'silence', matchId: 'computed-property.override' },
  ],
};
