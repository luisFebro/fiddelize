export default function observeElemView(elem, callback, opts = {}) {
    const {
        animaIn,
        speed = "normal",
        threshold,
        rootMargin,
        needPreload,
        once = true } = opts;
        // ISSUE: once with false triggers multiple times with animation. use only for detection of elements!

    if(!elem) return;

    let elements; // elements can be a string or a React Ref.
    if(typeof elem === "string") {
        elements = document.querySelectorAll(elem);
    } else {
        elements = elem;
    }
    console.log(elem);

    const config = {
      root: null, // html root default or document.querySelector("#scrollArea")
      rootMargin: rootMargin ? `0px 0px ${rootMargin}px 0px` : "0px", // "e.g preload image before achieving elem"
      threshold: threshold ? threshold : 0, // n2 // 0.5 === 50% (right in the middle) "e.g trigger inside target elem from 0.0 earlier (top) to 1.0 later (bottom)"
    };

    const needUnobserve = once || needPreload;

    const elemObserver = new IntersectionObserver((entries, self) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                callback(true);
                needPreload && intersectionHandler(entry, "in", { isImg: needPreload ? true : false, needAnima: needPreload ? true : false});
                needUnobserve && self.unobserve(entry.target);
            } else {
                callback(false);
            }
        });

    }, config);

    if(typeof elem !== 'string') {
        elements && elemObserver.observe(elements);
    } else {
        elements.forEach(selectedElem => {
            console.log("selectedElem", selectedElem);
            selectedElem.style.opacity = "0";
            elemObserver.observe(selectedElem)
        }); // n1
    }

    function intersectionHandler(entry, status, opts) {
        const { isImg, needAnima } = opts;

        if(status === "in") {
            isImg && preloadImages(entry, needAnima);
        }
    }

    function preloadImages(imgElem, needAnima) {
        const target = imgElem.target;
        const src = target.getAttribute('data-src');

        if (!src) { return; }
        target.src = src;
        needAnima && setTimeout(() => target.classList.add("animated", animaIn, speed), 1500);
    }
}