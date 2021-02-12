import throttle from '../performance/throttle';

// needPartial if only a part of the element is displayed to trigger...
// callback returns a value which need to be used as an argument like:
// checkIfElemIsVisible("#elem", res => setData(res));
// detectionOnce is for the cases when you just need the first true result and disable scrolling detection right after...

// const isFunction = func => typeof callback === 'function';
// for now, only work using one function per component...
export default function animateVisibleElem(elem, callback, opts = {}) {
    const {
        animaIn,
        animaOut,
        speed = "normal",
        threshold,
        rootMargin,
        once = true } = opts;
        // ISSUE: once with false triggers multiple times.

    if(!elem) throw Error("You need to declare an element as the first parameter");

    const elements = document.querySelectorAll(elem);

    const config = {
      root: null, // html root default or document.querySelector("#scrollArea")
      rootMargin: rootMargin ? `-${rootMargin}px 0px 0px 0px` : "0px", // "e.g preload image before achieving elem"
      threshold: threshold ? threshold : 0, // n2 // 0.5 === 50% (right in the middle) "e.g trigger inside target elem from 0.0 earlier (top) to 1.0 later (bottom)"
    };

    let isLeaving = false;
    const elemObserver = new IntersectionObserver((entries, self) => {
        entries.forEach(entry => {
            const inView = entry.isIntersecting;
            const target = entry.target;

            if(inView) {
                target.style.opacity = "1";
                isLeaving = true;
                if(typeof callback === "function") { callback(); }

                intersectionHandler(entry, "in");
                once && self.unobserve(entry.target);
            } else if (isLeaving) {
                intersectionHandler(entry, "out");
                isLeaving = false;
            }
        });

    }, config);

    elements.forEach(selectedElem => {
        selectedElem.style.opacity = "0";
        elemObserver.observe(selectedElem)
    }); // n1

    function intersectionHandler(entry, status) {
        if(status === "in" && entry.isIntersecting) {
            entry.target.classList.remove("animated", animaOut, speed);
            entry.target.classList.add("animated", animaIn, speed);
        } else {
            entry.target.classList.remove("animated", animaIn, speed);
            entry.target.classList.add("animated", animaOut, speed);
        }
    }

}


/* COMMENTS
Comprehensive exemples:
https://www.smashingmagazine.com/2018/01/deferring-lazy-loading-intersection-observer-api/#deconstructing-intersectionobserver

if(intersectionRatio > 0.5){ this condition will show the element when more than 50 % of it are visible.


 Here’s how you could act on the observed elements either entering the view or leaving the view:

const myImgs = document.querySelectorAll('.animate-me');

observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.intersectionRatio > 0) {
      console.log('in the view');
    } else {
      console.log('out of view');
    }
  });
});

myImgs.forEach(image => {
  observer.observe(image);
});
https://alligator.io/js/intersection-observer/

n2: definition threshold: limite
the magnitude or intensity that must be exceeded for a certain reaction, phenomenon, result, or condition to occur or be manifested.
*/