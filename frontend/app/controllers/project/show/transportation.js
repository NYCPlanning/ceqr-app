import Controller from '@ember/controller';
import { alias } from '@ember-decorators/object/computed';

export default class ProjectShowTransportationController extends Controller {
  @alias('model.project') project;
  @alias('model.transportationAnalysis') analysis;
}
