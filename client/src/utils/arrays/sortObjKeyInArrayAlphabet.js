export default function sortObjKeyInArrayAlphabet(arrayToSort, key) {
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

    arrayToSort = arrayToSort.sort((a, b) => handleSort(a, b, key));
    return arrayToSort;
}