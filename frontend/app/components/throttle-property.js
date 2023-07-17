import Component from '@ember/component';
import { restartableTask } from 'ember-concurrency-decorators';
import { timeout } from 'ember-concurrency';

const DEFAULT_TIMEOUT_MS = 500;

// This component takes a property, which is assumed to be bound
// through templates, and throttles the update stream to a given
// number of milliseconds. The throttled updates are yielded
export default class ThrottlePropertyComponent extends Component {
  init(...args) {
    super.init(...args);

    this.didUpdateAttributesTask.perform();
  }

  // bound property to throttle updates
  property = null;

  timeout = DEFAULT_TIMEOUT_MS;

  didUpdateAttrs() {
    super.didUpdateAttrs();
    this.didUpdateAttributesTask.perform();
  }

  @restartableTask({
    maxConcurrency: 1,
  })
  *didUpdateAttributesTask() {
    yield timeout(this.milliseconds);

    return this.property;
  }
}
