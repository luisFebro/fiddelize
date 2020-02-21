// clear object in a react state using hooks
// NOT WORKING very well. Not cleaning up after user has registered.
export default function clearForm(setObj, objHook, newAssignedVal = '') {
    const tempForm = objHook;
    let key;
    for (key in tempForm) {
        tempForm[key] = newAssignedVal;
    }
    setObj(tempForm);
}