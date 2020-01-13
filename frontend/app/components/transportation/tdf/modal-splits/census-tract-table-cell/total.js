import Component from '@ember/component';
import { computed } from '@ember/object';
import { censusTractVariableForMode } from 'labs-ceqr/utils/censusTractVariableForMode';

export default class TransportationTdfModalSplitsCensusTractTableCellTotalComponent extends Component {
  tagName = 'td';

  @computed('activeModes', 'tract')
  get tractTotal() {
    let total = 0;
    
    this.activeModes.forEach((mode) => {
      const key = censusTractVariableForMode(mode);
      total += this.tract[key].value;
    });

    return total;
  }
}
