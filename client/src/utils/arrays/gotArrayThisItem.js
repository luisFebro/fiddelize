// strictly equality.
export default function gotArrayThisItem(array, targetStr) {
    return array.some(item => targetStr.includes(item))
}

