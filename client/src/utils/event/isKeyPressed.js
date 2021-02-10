// use onKeyPress to detect the event in a form's field
// keyName needs to be a string with the name of the keyboard like Enter, d, g, etc...
export default function isKeyPressed(event, keyName) {
    const keyTypedNow = event.key;
    // const charNumericCode = event.which || event.keyCode; // e.g 13 for Enter.
    //console.log(`The code for ${keyTypedNow.toUpperCase()} is ${charNumericCode}`);

    if (!keyName) throw new Error("Oops! It is required a keyName");

    if (keyTypedNow === keyName) {
        event.preventDefault(); // prevent submit a query string like with Enter key
        return true;
    }

    return false;
}

// next is the callback function that will handle something if after Enter is pressed.
// usage example: onKeyPress={e => handleEnterPress(e, checkAccess)}
const handleEnterPress = (e, next) => {
    const isEnter = isKeyPressed(e, "Enter");
    if (isEnter) {
        next();
    }
};

export { handleEnterPress };
