import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  controllerName: 'project',

  async model(params) {
    const project = await this.get('store').findRecord(
      'project',
      params.id,
      {
        include: [
          'public-schools-analysis',
          'transportation-analysis',
          'transportation-analysis.transportation-planning-factors',
          'community-facilities-analysis',
          'data-package',
        ].join(','),
      },
    );

    const mapplutoVersions = await this.store.query('data-package', { filter: { package: 'mappluto' } });

    return RSVP.hash({
      project,
      mapplutoVersions,
      publicSchoolsAnalysis: project.publicSchoolsAnalysis,
      transportationAnalysis: project.transportationAnalysis,
      communityFacilitiesAnalysis: project.communityFacilitiesAnalysis,
    });
  },
});
