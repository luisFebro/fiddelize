// This will replace checkIfElemIsVisible.
export default function detectSingleElemScroll(elemQuery, options = {}) {
    const { callback } = options;

    if (!elemQuery) return console.log("ERROR: Missing elem Query");
    const finalElem = document.querySelector(elemQuery);
    // const isElementType = finalElem && finalElem.nodeType;
    // if(!isElementType) return;

    if (
        "IntersectionObserver" in window &&
        "IntersectionObserverEntry" in window &&
        "intersectionRatio" in window.IntersectionObserverEntry.prototype
    ) {
        const observer = new IntersectionObserver((entries) => {
            const isIntersecting = entries[0].isIntersecting;
            callback(isIntersecting);
        });
        observer.observe(finalElem);
    }
}

/*
if(entries[0].boundingClientRect.y > 500) {
    console.log("larger than 500px")
}
 */
