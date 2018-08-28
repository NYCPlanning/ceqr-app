import { htmlSafe } from '@ember/template';

export default {
  ps:   '#414F70',
  psis: '#9197AE',
  is:   '#A1A66B',
  ishs: '#82735C',
  hs:   '#566144',

  styleFor(level) {
    return htmlSafe(`color: ${this[level.toLowerCase()]}`);
  },
};