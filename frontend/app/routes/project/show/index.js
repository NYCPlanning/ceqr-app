import Route from '@ember/routing/route';

export default Route.extend({
  controllerName: 'project',

  actions: {
    error(error) {
      console.log("error from project/show/index: ", error); // eslint-disable-line
    }
  }
});