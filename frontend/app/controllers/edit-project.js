import Controller from '@ember/controller';
import ProjectValidations from '../validations/project';

export default class EditProjectController extends Controller {
  ProjectValidations = ProjectValidations;
}
