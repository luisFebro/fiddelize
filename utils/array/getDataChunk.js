function getDataChunk(arrayData, options = {}) {
    if(!arrayData) throw new Error("You should pass an array of object as the first argument.")

    let { skip, limit, search } = options;
    if(!skip) skip = 0; // default
    if(!limit) limit = arrayData.length; // default

    const handleLimit = (skip, limit) => {
        if(limit === 1) return skip + 1;
        if(skip) return limit * (skip + 1);
        return limit;
    }

    const finalLimit = handleLimit(skip, limit);
    skip = limit * skip;

    return arrayData.slice(skip, finalLimit);
}

module.exports = getDataChunk;

// e.g
// const array = [{a: "a"}, {b: "b"}, {c: "c"}, {d: "d"}, {e: "e"}, {f: "f"}];
// const res = getDataChunk(array, { skip: undefined, limit: undefined })
// console.log("res", res); // [ { d: 'd' }, { e: 'e' }, { f: 'f' } ]



