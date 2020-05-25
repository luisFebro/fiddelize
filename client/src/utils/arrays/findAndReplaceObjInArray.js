// arguments should be Array of objects preferencially with id.
export default function findAndReplaceObjInArray(rootArray, newArray, keyToFind) {
    const result = rootArray.map(elem => {
        const newItem = newArray.find(elem2 => elem2[keyToFind] === elem[keyToFind]); // n1 - destructuring
        return newItem ? newItem : elem;
    });
    return result;
}

/* COMMENTS
n1: I could use destructuring:
({ keyToFind }} => keyToFind === elem[keyToFind]
but the argument should not be a string. This will not work inside the function.
*/