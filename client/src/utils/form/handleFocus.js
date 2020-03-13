export const handleFocus = (nextFieldToFocusId, timeInSec = 0) => {
    const elem = document.getElementById(nextFieldToFocusId);
    setTimeout(() => elem && elem.focus(), timeInSec);
}