/**
 * [sortArray]
 * @param  {Array} targetArray [an array with objects]
 * @param  {String} sortBy
 * @param  {String} target [the element inside array to be sorted]
 * @return {Array} Array with sorted elements
 */
function sortArray(targetArray, options = {}) {
    const { sortBy = "lowest", target = "ind" } = options;

    const validSort = ["highest", "lowest"];
    if (!validSort.includes(sortBy))
        return console.log("sortBy can only be these values: " + validSort);

    if (sortBy === "highest") {
        targetArray.sort((a, b) => b[target] - a[target]);
    } else {
        targetArray.sort((a, b) => a[target] - b[target]);
    }

    return targetArray;
}

module.exports = sortArray;

/* EXAMPLE
const targetArray = [{"pos":0,"ind":"blue"},{"pos":4,"ind":"pink"},{"pos":2,"ind":"red"}]

const res = sortArray(targetArray, { target: "pos" });
console.log("res", res);
res [ { pos: 0, ind: 'blue' },
  { pos: 2, ind: 'red' },
  { pos: 4, ind: 'pink' } ]
*
*/
