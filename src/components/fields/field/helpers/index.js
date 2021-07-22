import { handleEnterPress as handlePress } from "../../../../utils/event/isKeyPressed";

export const handleEnterPress = (e, enterCallback) => {
    if (!enterCallback) return;
    return handlePress(e, enterCallback);
};

// changeCallback should use useState
// name and value should have the same word.
export const handleOnChange = (e, changeCallback) => {
    const { name, value } = e.target;
    if (!changeCallback || !name) return null;

    return changeCallback((prev) => {
        const needOnlyValue = typeof prev !== "object";
        if (needOnlyValue) return value;

        return {
            ...prev,
            [name]: value,
        };
    });
};
