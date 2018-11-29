// Found online: http://www.jacklmoore.com/notes/rounding-in-javascript/
export default function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}