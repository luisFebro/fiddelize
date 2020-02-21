function removeItemArray(array, itemToBeRemoved) {
    const indFound = array.indexOf(itemToBeRemoved);
    array.splice(indFound, 1)
    return array;
}

module.exports = removeItemArray;