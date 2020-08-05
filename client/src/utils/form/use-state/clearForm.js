// clear object in a react state using hooks
// NOT WORKING very well. Not cleaning up after user has registered.
export default function clearForm(setObj, objHook, newAssignedVal = '') {
    if(!objHook) {
        setObj(data => {
            const newObj = {};
            let thisKey;

            for(thisKey in data) {
                newObj[thisKey] = "";
            }

            return newObj;
        })

        return;
    }

    const tempForm = objHook;
    let key;
    for (key in tempForm) {
        tempForm[key] = newAssignedVal;
    }
    setObj(tempForm);
}