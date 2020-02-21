// Updating Info Isntantly
//The obj needs to have this format: {id: "123", key: "value"}
//targetKey will get whatever key in the second position to update.
// This will update a key in an array made of objects.
export default function updateKeyWithId(obj, objToUpdate, id) {
    const _id = objToUpdate._id;
    const key = Object.keys(objToUpdate)[1], value = objToUpdate[key];
    const objIndex = obj.findIndex(objEach => objEach._id === _id);
    obj[objIndex][key] = value;
    return obj;
}




