import {
  validatePresence,
  validateLength,
} from 'ember-changeset-validations/validators';

export default {
  name: validateLength({ min: 3 }),
  buildYear: validatePresence(true),
  bbls: validateLength({
    min: 1,
    message: 'The project should have at least one BBL',
  }),
};
