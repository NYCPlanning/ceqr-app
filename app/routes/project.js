import Route from '@ember/routing/route';

export default Route.extend({  
  model(params) {
    return this.get('store').createRecord('project', {
      projectId: params.project_id,
      address: "120 Broadway",
      yearBuilt: 2019,
      totalUnits: 0,
      seniorUnits: 0,
    });
  }
});
