const getChunksTotal = (dataSize, limit) => Math.ceil(dataSize / limit);

function getDataChunk(arrayData, options = {}) {
    if(!arrayData) throw new Error("You should pass an array of object as the first argument.")

    let { skip, limit, search } = options;
    skip = parseInt(skip); limit = parseInt(limit);
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

const getSkip = (skip, limit) => {
    if(Number.isNaN(skip) || !limit) return console.log("missing arguments");
    if(skip === 0) return skip;
    return limit * skip;
}

module.exports = { getDataChunk, getChunksTotal, getSkip };

// e.g
// const array = [{a: "a"}, {b: "b"}, {c: "c"}, {d: "d"}, {e: "e"}, {f: "f"}];
// const res = getDataChunk(array, { skip: undefined, limit: undefined })
// console.log("res", res); // [ { d: 'd' }, { e: 'e' }, { f: 'f' } ]



