export default function removeArrayItem(array = [], item) {
    if (!array.length) return [];

    const targetInd = array.indexOf(item);
    // if no item found, return the original array
    if (targetInd < 0) return array;

    array.splice(targetInd, 1);

    return array;
}

/* example
const ids = ["12345", "abcd", "denis", "21313232132"];
console.log(removeListItem(ids, "denis")); // [ '12345', 'abcd', '21313232132' ]
 */
