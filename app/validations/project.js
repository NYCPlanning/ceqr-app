import { validatePresence, validateNumber, validateLength } from 'ember-changeset-validations/validators';

export default {
  name: validateLength({ min: 3 }),
  ceqr_number: validatePresence(true),
  buildYear: validatePresence(true),
  totalUnits: validateNumber({gte: 1}),
  bbls: validateLength({ min: 1, message: 'The project should have at least one BBL'})
}