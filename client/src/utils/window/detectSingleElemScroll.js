// This will replace checkIfElemIsVisible.
export default function detectSingleElemScroll(elemQuery, options = {}) {
    const { callback } = options;

    if (!elemQuery) return console.log("ERROR: Missing elem Query");

    if (
        "IntersectionObserver" in window &&
        "IntersectionObserverEntry" in window &&
        "intersectionRatio" in window.IntersectionObserverEntry.prototype
    ) {
        const observer = new IntersectionObserver((entries) => {
            const isIntersecting = entries[0].isIntersecting;
            callback(isIntersecting);
        });
        observer.observe(document.querySelector(elemQuery));
    }
}

/*
if(entries[0].boundingClientRect.y > 500) {
    console.log("larger than 500px")
}
 */
