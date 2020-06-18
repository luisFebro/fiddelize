export default function sortObjKeyInArrayAlphabet(arrayToSort, key, needInsertIndex) {
    let newSortedArray;
    const handleSort = (aValue, bValue, key) => {
        aValue = aValue[key];
        bValue = bValue[key];

        if (aValue > bValue) {
            return 1;
        } else if (aValue < bValue) {
            return -1;
        } else {
            return 0;
        }
    }

    newSortedArray = arrayToSort.concat().sort((a, b) => handleSort(a, b, key));

    if(needInsertIndex) {
        const arraySortedWithInd = newSortedArray.map((iconObj, index) => {
            iconObj.id = index;
            return iconObj;
        })
        return arraySortedWithInd;
    }
    return arrayToSort;
}