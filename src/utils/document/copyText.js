// copy text to clipboard without a visible input field
// https://stackoverflow.com/questions/50795042/create-a-copy-button-without-an-input-text-box
// parentId (current div wrapper when the copy button is) = use it when inside a modal or similar, when inserting to document.body fails.
export default function copyText(txt, callback, options = {}) {
    const { parentId = null } = options;

    let parentElem;
    if (parentId) {
        parentElem = document.getElementById(parentId);
    }

    if (!txt) throw new Error("txt argument is missing...");

    const tempInput = document.createElement("input");
    tempInput.value = txt;

    if (parentElem) {
        parentElem.appendChild(tempInput);
    } else {
        document.body.appendChild(tempInput);
    }

    tempInput.select();

    document.execCommand("copy");

    if (parentElem) {
        parentElem.removeChild(tempInput);
    } else {
        document.body.removeChild(tempInput);
    }

    if (typeof callback === "function") {
        callback();
    }
}
