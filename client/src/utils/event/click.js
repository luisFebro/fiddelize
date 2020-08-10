var clickEvent = new MouseEvent("click", {
    "view": window,
    "bubbles": true,
    "cancelable": false
});

export default function click(elem, options = {}) {
    const { callback } = options;

    const thisElem = document.querySelector(elem);
    if(thisElem) {
        thisElem.dispatchEvent(clickEvent);
        thisElem.click();
        if(typeof callback === "function") {
            callback();
        }
    }
}