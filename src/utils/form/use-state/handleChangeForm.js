const handleChangeForm = (setObj, obj, formData, anotherName = "phone") => (
    e
) => {
    const { name } = e.target;

    const isPhoto = name === anotherName;
    const value = isPhoto ? e.target.files[0] : e.target.value;

    formData.append(name, value);
    setObj({ ...obj, [name]: value });
};

export default handleChangeForm;
