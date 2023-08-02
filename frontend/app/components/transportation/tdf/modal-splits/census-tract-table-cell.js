import Component from '@ember/component';
import { computed } from '@ember/object';
import { censusTractVariableForMode } from '../../../../utils/censusTractVariableForMode';

export default class TransportationTdfModalSplitsCensusTractCellComponent extends Component {
  tagName = 'td';

  @computed('mode', 'tract')
  get tractValue() {
    const variable = censusTractVariableForMode(this.mode);
    return this.tract[variable].value;
  }
}
