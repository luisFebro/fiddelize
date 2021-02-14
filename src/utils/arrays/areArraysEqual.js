// https:stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
export default function areArraysEqual(array1, array2) {
    if (array1 === array2) return true;
    if (array1 == null || array2 == null) return false;
    if (array1.length != array2.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.

    for (let i = 0; i < array1.length; ++i) {
        if (array1[i] !== array2[i]) return false;
    }
    return true;
}

// console.log(areArraysEqual(["a", "b", "c"], ["a", "c", "b"]))
