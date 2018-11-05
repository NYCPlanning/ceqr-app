import Component from '@ember/component';
import { computed } from '@ember-decorators/object';

export default class Nov2018Multipliers extends Component {
  
  @computed('project.manual.districts')
  get multipliers() {
    const districts = this.project.manual.districts;
    if (!districts) return {};
    
    const bx = districts.filterBy('borocode', 'bx').sortBy('csd');
    const bk = districts.filterBy('borocode', 'bk').sortBy('csd');
    const mn = districts.filterBy('borocode', 'mn').sortBy('csd');
    const qn = districts.filterBy('borocode', 'qn').sortBy('csd');
    const si = districts.filterBy('borocode', 'si').sortBy('csd');

    return {
      bx: { count: bx.length, districts: bx },
      bk: { count: bk.length, districts: bk },
      mn: { count: mn.length, districts: mn },
      qn: { count: qn.length, districts: qn },
      si: { count: si.length, districts: si },
    };
  } 
}
