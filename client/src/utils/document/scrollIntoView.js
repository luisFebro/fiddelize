export default function scrollIntoView(thisElem, delay = 0) {
    if(!thisElem) throw new Error("You have to specify an element with # (id) or . (class)");
    if(!thisElem.includes('#')) throw new Error("Insert # (id) along with the element's name");

    const elem = document.querySelector(thisElem);

    if(elem) {
        setTimeout(() => elem.scrollIntoView(), delay);
    }
}