// strictly equality.
export default function gotArrayThisItem(array, targetStr) {
    if(!array || !targetStr) return false;
    return array.some(item => targetStr.includes(item))
}

