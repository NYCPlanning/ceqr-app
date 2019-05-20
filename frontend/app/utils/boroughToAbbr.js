export default function boroughToAbbr(borough) {
  switch (borough) {
    case 'Manhattan': return 'mn';
    case 'Bronx': return 'bx';
    case 'Brooklyn': return 'bk';
    case 'Queens': return 'qn';
    case 'Staten Island': return 'si';
    default: return null;
  }
}