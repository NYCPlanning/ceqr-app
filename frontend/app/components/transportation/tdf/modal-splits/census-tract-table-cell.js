import Component from '@ember/component';
import { computed } from '@ember/object';
import { censusTractVariableForMode } from '../../../../utils/censusTractVariableForMode';

export default class TransportationTdfModalSplitsCensusTractCellComponent extends Component {
  /* eslint-disable-next-line ember/require-tagless-components */
  tagName = 'td';

  @computed('mode', 'tract')
  get tractValue() {
    const variable = censusTractVariableForMode(this.mode);
    return this.tract[variable].value;
  }
}
