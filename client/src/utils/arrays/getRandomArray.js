/**
 * randomize a specific array
 * @param  {Array} array [target array,especially composed byobjs]
 * @return {Array | Object | String}       [selected String or Obj, or ramdomized array passed in the parameter]
 */
export default function getRandomArray(array, options = {}) {
    const { selectOne = true } = options;

    const sortedArray = array.sort(function (a, b) {
        return 0.5 - Math.random();
    });

    const ind = array.length;
    const randomNum = Math.floor(Math.random() * ind); // 0 to 9 index. select one of the first 10 results from the random array.

    if (selectOne) return sortedArray[randomNum];

    return sortedArray;
}
