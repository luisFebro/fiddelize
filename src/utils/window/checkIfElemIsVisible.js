// prefer using detectScrollSingleElem.js
import throttle from "../performance/throttle";

// needPartial if only a part of the element is displayed to trigger...
// callback returns a value which need to be used as an argument like:
// checkIfElemIsVisible("#elem", res => setData(res));
// detectionOnce is for the cases when you just need the first true result and disable scrolling detection right after...

// const isFunction = func => typeof callback === 'function';
// for now, only work using one function per component...
export default function checkIfElemIsVisible(elem, callback, opts = {}) {
    const {
        needPartial = true,
        throttleSpan = 300,
        leading = true,
        trailing = true,
        detectionOnce = false,
    } = opts;

    const handleScrollEvent = () => {
        window.onscroll = throttle(
            function () {
                // LESSON
                isElemVisible(elem, callback, needPartial);
            },
            throttleSpan,
            { leading, trailing }
        );
    };

    handleScrollEvent();

    function isElemVisible(elem, callback, needPartial) {
        if (!elem)
            throw Error(
                "You need to declare an element as the first parameter"
            );

        elem = document.querySelector(elem);
        if (elem) {
            const rect = elem.getBoundingClientRect();
            const elemTop = rect.top;
            const elemBottom = rect.bottom;

            let res;
            const isTotallyVisible =
                elemTop >= 0 && elemBottom <= window.innerHeight;
            const isPartiallyVisible =
                elemTop < window.innerHeight && elemBottom >= 0;

            res = needPartial ? isPartiallyVisible : isTotallyVisible;

            callback(res);

            if (detectionOnce && res) {
                window.onscroll = null;
            } else {
                handleScrollEvent();
            }
        }
    }
}

/* COMMENTS
n1: do not use a wrapper function plugged in an DOM event because it will not be triggered.

const run = throttle(function() { // LESSON
    const res = isElemVisible(elem, callback, needPartial) ? true : false;
    finalRes = res;
}, throttleSpan, { leading, trailing });

window.onscroll = run; // or run() - this latter runs only once;

then plug it directly
*/
