import throttle from '../performance/throttle';

// needPartial if only a part of the element is displayed to trigger...
// callback returns a value which need to be used as an argument like:
// checkIfElemIsVisible("#elem", res => setData(res));
// detectionOnce is for the cases when you just need the first true result and disable scrolling detection right after...

// const isFunction = func => typeof callback === 'function';
// for now, only work using one function per component...
export default function animateVisibleElem(elem, opts = {}) {
    const {
        animaIn,
        animaOut,
        speed = "normal",
        needPartial = false,
        once = true } = opts;
        // ISSUE: once with false triggers multiple times.

    if(!elem) throw Error("You need to declare an element as the first parameter");

    const elements = document.querySelectorAll(elem);

    const config = {
      root: null, // html root default
      rootMargin: needPartial ? "-100px 0px 0px 0px" : "0px", // e.g "-200px 0px 0px 0px"
      // threshold: needPartial ? [0.3] : [0],
    };

    const elemObserver = new IntersectionObserver((entries, elemObserver) => {
        console.log("entries", entries);

        entries.forEach(entry => {
            if (entry.intersectionRatio > 0) {
                entry.target.classList.remove('animated', animaOut, speed)
                entry.target.classList.add('animated', animaIn, speed)

                once && elemObserver.unobserve(entry.target);
            } else {
                entry.target.classList.remove('animated', animaIn, speed)
                entry.target.classList.add('animated', animaOut, speed)
            }
        });

    }, config);

    elements.forEach(selectedElem => {
        selectedElem.style.opacity = "0";
        elemObserver.observe(selectedElem)
    }); // n1


    // runElemObserver();
    // function runElemObserver() {

    // }

}



/* COMMENTS
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
*/