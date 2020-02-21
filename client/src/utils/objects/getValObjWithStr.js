export default function getValObjWithStr(obj, path) {
    const paths = path.split('.');
    let curr = obj;

    paths.forEach(path => {
        return curr[path] === undefined
        ? undefined
        : curr = curr[path];
    })
    return curr;
}
// e.g
// const obj = {
//     "hello": "worked!!!",
//     "bye": "bye",
// }

// console.log(getValObjWithStr(obj, "obj.hello"))
// #
// worked!!!