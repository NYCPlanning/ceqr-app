import Route from '@ember/routing/route';
import ResetScrollPositionMixin from '../../../../../mixins/reset-scroll-position';

export default Route.extend(ResetScrollPositionMixin, {
  controllerName: 'project'
});
