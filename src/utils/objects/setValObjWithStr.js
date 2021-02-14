export default function setValObjWithStr(obj, path, value) {
    if (!obj || !value || !path) return;

    let curr = obj;
    const paths = path.split(".");
    const len = paths.length;

    // paths.forEach(path => {
    //     return !curr[path]
    //     ? curr[path] = {}
    //     : curr = curr[path];
    // })

    for (let i = 0; i < len - 1; i++) {
        const elem = paths[i];
        if (!curr[elem]) {
            curr[elem] = {};
        }
        curr = curr[elem];
    }

    curr[paths[len - 1]] = value;

    return curr;
}

// e.g
// const obj = {
//     "hello": {
//         a: "worked!!!",
//     },
//     "bye": "bye",
// }
// console.log(setValObjWithStr(obj, "hello.a", "I got it!!!")) // it does not erquies the obj name
// console.log(obj)
// #
// { a: 'I got it!!!' }
// { hello: { a: 'I got it!!!' }, bye: 'bye' }
