export default function setValObjWithStr(obj, path, value) {
    var curr = obj;
    var paths = path.split('.');
    var len = paths.length;

    // paths.forEach(path => {
    //     return !curr[path]
    //     ? curr[path] = {}
    //     : curr = curr[path];
    // })

    for(var i = 0; i < len-1; i++) {
        var elem = paths[i];
        if( !curr[elem] ) {
            curr[elem] = {}
        }
        curr = curr[elem];
    }

    curr[paths[len-1]] = value;

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
