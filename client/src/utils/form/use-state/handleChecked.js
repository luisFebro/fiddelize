// toggle a checkbox in a react useState hook
// it requires two props:
// "checked" - whick will toggle true/false in the state
// "name" - this will identify the right key to change in the state.
const handleChecked = (setObj, obj) => e => { // n1
    const { checked, name } = e.target;
    setObj({...obj, [name]: checked});
}

export default handleChecked;


/* COMMENTS
n1: it is not allowed to write all arguments in one single function/parentheses like "handleChecked = (setObj, obj, key, e)" because target will return undefined.
*/