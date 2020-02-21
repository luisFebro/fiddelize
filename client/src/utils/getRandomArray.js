/**
 * randomize a specific array
 * @param  {Array} array [target array,especially composed byobjs]
 * @return {Array}       [ramdomized array passed in the parameter]
 */
export const getRandomArray = array => {
    return array.sort(function(a, b) {
        return 0.5 - Math.random();
    });
};
