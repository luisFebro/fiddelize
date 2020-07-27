const filterAndCount = (arrayData, options) => {
    const { count, rules } = options;
    let { compare } = options;

    if(!arrayData) throw new Error("requires an array of objects as the first argument.")
    if(compare && !Array.isArray(compare)) throw new Error("compare should be an arrays of comparison operators")

    const getProp = obj => Object.keys(obj)[0];
    const getValue = obj => Object.values(obj)[0];

    const handleFilterCondition = (elem, ind) => {

        if(rules === undefined) return;

        let comparisonResults = [];
        rules.forEach(objProp => {
            const prop = getProp(objProp); const value = getValue(objProp);
            if(!compare || compare === "===") comparisonResults.push(value.toString().includes(elem[prop]));
        })

        return comparisonResults.every(res => res === true);
    }

    const filtered = arrayData.filter((elem, ind) => handleFilterCondition(elem, ind));
    // even if there is an empty array, it will return a default zero.
    return filtered.reduce((acc, next) => acc + next[count], 0);
}


module.exports = filterAndCount;

// const array = [{type: "prize", challN: 1, value: 100}, {type: "remainder", challN: 1, value: 200}, {type: "prize", challN: 1, value: 200}, {type: "record", challN: 1, value: 300}, {type: "record", challN: 1, value: 400}]
// const res = filterAndCount(array, {
//     count: "value",
//     rules: [{ challN: 2 }, { type: "prize || remainder" }],
// })
// console.log(res);  // 500