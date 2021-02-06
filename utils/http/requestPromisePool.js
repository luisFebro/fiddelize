const PromisePool = require("@supercharge/promise-pool");

// returns a promise with object { results, error }
async function requestPromisePool(data, options = {}) {
    // n1
    const { promise, batchSize = 10, getParams } = options;

    return await PromisePool.for(data)
        .withConcurrency(batchSize)
        .process(async (eachElem) => {
            let params = eachElem;

            if (typeof getParams === "function") {
                params = getParams(params);
            }

            const res = await promise(params);

            return res;
        });
}

module.exports = requestPromisePool;

/*ex:
const timeOut = (t) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`Completed in ${t}`)
    }, t)
  })
}

const times = [1000, 2000, 3000]

requestPromisePool(times, { promise: timeOut }).then(res => console.log(res));
*/

/* COMMENTS
n1: docs: https://superchargejs.com/docs/master/promise-pool
*/
