// change state of a React Hook
// the component need to have "name" explicitally assigned with the target key in the state.
const handleChange = (setObj, obj) => e => {
    const { name, value } = e.target;
    setObj({ ...obj, [name]: value });
}

export default handleChange;
