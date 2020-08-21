function findKeyAndAssign({
    objArray = [],
    compareProp = "_id",
    compareValue = "5f0a03cae8df011018b197a4",
    targetProp = "done",
    targetValue = true,
    keyValueObj,
}) {
    if(!compareValue) return console.log("need a compareValue ")
    compareValue = JSON.stringify(compareValue);

    return objArray.map(obj =>
        {
            if(JSON.stringify(obj[compareProp]) === compareValue) {
                keyValueObj
                ? handleMultiAssignment({ obj, keyValueObj })
                : obj[targetProp] = targetValue
            }
            return obj;
        });
}

function handleMultiAssignment({ obj, keyValueObj }) {
    const keys = Object.keys(keyValueObj);
    const values = Object.values(keyValueObj);

    keys.map((key,ind) => {
        const currValue = values[ind];
        obj[key] = currValue;
    })

    return obj;
}

module.exports = findKeyAndAssign;


// e.g
// const array = [
//     {
//         "_id": "saf2432fdsfds",
//         "done": false,
//         "madeDate": "123",
//     },
//     {
//         "_id": "saf24fdsfdd334fdsfds",
//         "done": false,
//         "madeDate": "432",
//     }
// ]

// const keyValueObj = {
//     done: true,
//     madeDate: new Date(),
// }

// const newArray = findKeyAndAssign({
//     objArray: array,
//     compareProp: '_id', compareValue: "saf2432fdsfds",
//     targetProp: 'isCanceled', targetValue: true,
// })
// console.log(newArray);
/*
[ { _id: 'saf2432fdsfds',
    done: false,
    madeDate: '123',
    isCanceled: true },
  { _id: 'saf24fdsfdd334fdsfds', done: false, madeDate: '432' } ]
 */
