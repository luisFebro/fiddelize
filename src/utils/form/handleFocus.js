import scrollIntoView from '../document/scrollIntoView';

const getFocus = (elem) => {
    return elem.focus();
}

export const handleFocus = (fieldToFocus, options = {}) => {
    const { mode, delay, offset, duration, querySelector = false } = options;

    let elem;
    if(querySelector) {
        elem = document.querySelector(fieldToFocus);
    } else {
        elem = document.getElementById(fieldToFocus);
    }

    if(!elem) return;
    scrollIntoView(elem, { mode, delay, offset, duration, onDone: () => getFocus(elem) })
}