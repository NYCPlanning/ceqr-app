import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/string';

export function modeLabel(params) {
  
  switch (params[0]) {
    case 'auto':       return htmlSafe('<i class="car icon"></i> Auto (Car, Truck, Van)');
    case 'taxi':       return htmlSafe('<i class="taxi icon"></i> Taxicab');
    case 'bus':        return htmlSafe('<i class="bus icon"></i> Bus (or Trolleybus)');
    case 'subway':     return htmlSafe('<i class="subway icon"></i> Subway (or Elevated)');
    case 'railroad':   return htmlSafe('<i class="train icon"></i> Railroad');
    case 'walk':       return htmlSafe('Walked');
    case 'ferry':      return htmlSafe('<i class="ship icon"></i> Ferryboat');
    case 'streetcar':  return htmlSafe('Streetcar or Trolley Car');
    case 'bicycle':    return htmlSafe('<i class="bicycle icon"></i> Bicycle');
    case 'motorcycle': return htmlSafe('<i class="motorcycle icon"></i> Motorcycle');
    case 'other':      return htmlSafe('Other Means');
    case 'truck':      return htmlSafe('<i class="truck icon"></i> Truck (delivery)')
    default:           return params[0].capitalize();
  }
}

export default helper(modeLabel);
