import Controller from '@ember/controller';

export default class PasswordReset extends Controller {
  queryParams = ['token'];
  token = null;
}
