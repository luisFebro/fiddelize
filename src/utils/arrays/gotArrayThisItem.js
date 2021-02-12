// strictly equality.
export default function gotArrayThisItem(array, targetStr) {
  if (!array || !array.length || !targetStr) return false;
  return array.some((item) => targetStr.includes(item));
}
