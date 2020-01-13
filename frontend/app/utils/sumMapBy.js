export default function sumMapBy(array) {
  return array.reduce((acc, value) => {
    if (value === undefined) return acc;
    return acc + parseFloat(value);
  }, 0);
}
