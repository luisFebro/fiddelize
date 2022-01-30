export default function removeObjDuplicate(
    list = [],
    { filterId = "msgId", newObj }
) {
    // originalArr - The array on which filter() was called.
    // findIndex - The findIndex() method returns the index of the first element in the array that satisfies the provided testing function. Otherwise, it returns -1, indicating that no element passed the test.
    if (!list || !list.length) return [];
    const finalList = !newObj ? list : [...list, newObj];

    return finalList.filter(
        (item1, ind, originalArr) =>
            originalArr.findIndex(
                (item2) => item2.content[filterId] === item1.content[filterId]
            ) === ind // if find the item, returns its ind which should be the same as filter method, then we can remove duplicates.
    );
}

// reference: https://stackoverflow.com/questions/54134156/javascript-merge-two-arrays-of-objects-only-if-not-duplicate-based-on-specifi

// function mergeUniqueObjArrays(initialArray, newArray, id = "_id") {
//     const ids = new Set(initialArray.map((d) => d[id]));
//     const merged = [
//         ...initialArray,
//         ...newArray.filter((d) => !ids.has(d[id])),
//     ];
//     return merged;
// }
