import setValObjWithStr from '../../objects/setValObjWithStr';
// change state of a React Hook
// the component need to have "name" explicitally assigned with the target key in the state.
const handleChange = (setObj, obj, isNestedObj = false) => e => {
    const { name, value } = e.target; // n1

    if(isNestedObj) {
        setValObjWithStr(obj, name, value);
        const newObj = obj;
        setObj(Object.assign({}, obj, newObj));
    } else {
        if(!obj) {
            setObj(data => {
                if(typeof data === "string") {
                    return value;
                }
                return ({ ...data, [name]: value })
            })
        } else {
            setObj({ ...obj, [name]: value });
        }
    }
}

export default handleChange;

/* COMMENTS
n1: the name - ifisNestedObj is true - should be a string separated with dots like:
key.prop.moreOne (note that it does not includes the main object name)
*/
