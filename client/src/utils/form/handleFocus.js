import scrollIntoView from '../document/scrollIntoView';

const getFocus = (elem) => {
    return elem.focus();
}

export const handleFocus = (fieldToFocus, options = {}) => {
    const { mode, delay, offset, duration } = options;

    const elem = document.getElementById(fieldToFocus);
    scrollIntoView(elem, { mode, delay, offset, duration, onDone: () => getFocus(elem) })
}