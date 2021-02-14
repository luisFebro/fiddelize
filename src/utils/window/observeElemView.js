export default function observeElemView(elem, callback, opts = {}) {
    const {
        animaIn = "fadeIn",
        speed = "normal",
        threshold,
        rootMargin,
        loadImgs = false,
        needAnima,
        rootElem = null,
        imgWrapper = false,
        once = true,
    } = opts;
    // ISSUE: once with false triggers multiple times with animation. use only for detection of elements!

    if (!elem) return;

    let elements; // elements can be a string or a React Ref.
    if (typeof elem === "string") {
        elements = document.querySelectorAll(elem);
    } else {
        elements = elem;
    }

    const config = {
        root: rootElem ? document.querySelector(rootElem) : null, // html root default or document.querySelector("#scrollArea")
        rootMargin: rootMargin ? `0px 0px ${rootMargin}px 0px` : "0px", // "e.g preload image before achieving elem"
        threshold: threshold || 0, // n2 // 0.5 === 50% (right in the middle) "e.g trigger inside target elem from 0.0 earlier (top) to 1.0 later (bottom)"
    };

    const needUnobserve = once;

    const elemObserver = new IntersectionObserver((entries, self) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                callback(true);
                loadImgs && imgHandler(entry, { imgWrapper, needAnima });
                needUnobserve && self.unobserve(entry.target);
            } else {
                callback(false);
            }
        });
    }, config);

    if (typeof elem !== "string") {
        elements && elemObserver.observe(elements);
    } else {
        elements.forEach((selectedElem) => {
            if (needAnima) {
                selectedElem.style.opacity = "0";
            }
            elemObserver.observe(selectedElem);
        }); // n1
    }

    function imgHandler(entry, opts) {
        const { needAnima } = opts;

        loadImage(entry, { needAnima, imgWrapper });
    }

    function loadImage(imgElem, options = {}) {
        const { needAnima, imgWrapper } = options;

        const { target } = imgElem;

        if (needAnima) {
            target.style.opacity = "1";
        }

        if (imgWrapper) {
            const imgContainer = target.lastElementChild;

            const imgElem = imgContainer.firstElementChild;
            const src = imgElem.getAttribute("data-src");

            imgContainer.style.display = "block";
            imgElem.src = src;
            needAnima &&
                setTimeout(
                    () =>
                        imgContainer.classList.add("animated", animaIn, speed),
                    1500
                );
        } else {
            const src = target.getAttribute("data-src");
            if (!src) {
                return;
            }
            target.src = src;

            needAnima &&
                setTimeout(
                    () => target.classList.add("animated", animaIn, speed),
                    1500
                );
        }
    }
}
