import getValObjWithStr from '../../utils/objects/getValObjWithStr';

export default function updateKey(obj, objToUpdate) {
    let pathOrKey = Object.keys(objToUpdate)[0];
    const value = objToUpdate[pathOrKey];

    // if find a dot, means the obj is nested and we need to specify the target key.
    if(pathOrKey.includes(".")) {
        let ind = pathOrKey.lastIndexOf(".");
        const path = pathOrKey.substr(0, ind);
        const key = pathOrKey.slice(ind + 1);
        getValObjWithStr(obj, path)[key] = value;
    } else {
        obj[pathOrKey] = value;
    }
    return obj;
}
