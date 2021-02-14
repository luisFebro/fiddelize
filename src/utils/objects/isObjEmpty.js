// reference: https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object

export default function isObjEmpty(obj) {
    for (const eachProp in obj) {
        if (obj.hasOwnProperty(eachProp)) return false;
    }

    return true;
}

// console.log(isObjEmpty({})) // true
