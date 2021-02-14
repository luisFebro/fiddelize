// depracated - NOT USED replaced by userList.map(user => user.email);// return an obj for objects with different keys especially API like mongoDB.
// Pass all subkeys inside an array for the second argument.
export default function getDataObjDiffKeys(response, arrayOfSubKeys) {
    const objLength = Object.keys(response).length;
    const data = {};
    let x = 0;

    // Creating new keys provided by the array of the second argument
    for (; x < objLength; x++) {
        const currKey = arrayOfSubKeys[x];
        data[currKey] = [];
    }

    // Populating obj
    // getting keys from array
    for (const key of arrayOfSubKeys) {
        // getting each subkeys from diff objs
        for (const diffKey in response) {
            data[key].push(response[diffKey][key]);
        }
    }
    return data;
}

// let response = {
//     user1: {email: "hellothere@gmail.com", name: "john"},
//     user2: {email: "doe@gmail.com", name: "doe"}
// }

// e.g output
/* { name: [ 'john', 'doe' ],
  email: [ 'hellothere@gmail.com', 'doe@gmail.com' ] }
*/
