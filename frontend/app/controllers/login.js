import Controller from '@ember/controller';

export default class LoginController extends Controller {
  queryParams = ['validate'];
  validate = null;
}
