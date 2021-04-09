import { handleEnterPress as handlePress } from "../../../../utils/event/isKeyPressed";

export const handleEnterPress = (e, enterCallback) => {
    if (!enterCallback) return;
    return handlePress(e, enterCallback);
};

// changeCallback should be setData from useState
// name and value should have the same word.
export const handleOnChange = (e, changeCallback) => {
    const { name, value } = e.target;
    if (!changeCallback || !name) return;

    return changeCallback((prev) => ({
        ...prev,
        [name]: value,
    }));
};
