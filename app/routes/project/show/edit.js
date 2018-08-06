import Route from '@ember/routing/route';

export default Route.extend({
  controllerName: 'edit-project',

  actions: {
    saveProject: function(changeset) {            
      changeset.validate().then(() => {
        if (changeset.get("isValid")) {
          changeset.save().catch(error => {
            console.log(error);
          }).then(() => {
            this.transitionTo('project.show', this.get('controller.model.project').id);
          });
        }
      });
    },
  }
});