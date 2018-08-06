import Route from '@ember/routing/route';

export default Route.extend({
  controllerName: 'edit-project',

  actions: {
    save: function(changeset) {            
      changeset.validate().then(() => {
        if (changeset.get("isValid")) {
          changeset.save().catch(error => {
            console.log(error);
          }).then(() => {
            history.back();
          });
        }
      });
    },

    rollback: function(changeset) {
      return changeset.rollback();
    } 
  }
});