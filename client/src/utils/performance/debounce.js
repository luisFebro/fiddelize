// n1
// from lodash
export default function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};
/* COMMENTS
n1: debounce means "rebater"
debounce and throttle difference:
A debounce is a cousin of the throttle, and they both improve the performance of web applications. However, they are used in different cases. A debounce is utilized when you only care about the final state. For example, waiting until a user stops typing to fetch typeahead search results. A throttle is best used when you want to handle all intermediate states but at a controlled rate. For example, track the screen width as a user resizes the window and rearrange page content while it changes instead of waiting until the user has finished.
*/

/*
The function above will only fire once every quarter of a second instead of as quickly as it's triggered; an incredible performance boost in some cases.

Which rate?
I'm often asked what rate should be used when debouncing, and it's an impossible question to answer because it depends on the task.  The best way to know is testing different rates yourself and seeing where you notice a slowdown -- if you notice it, so will your users!

https://davidwalsh.name/javascript-debounce-function
 */

/* Implement infinite scroll:
window.onscroll = debounce(() => {
  if (
    window.innerHeight + document.documentElement.scrollTop
    === document.documentElement.offsetHeight
  ) {
    // Do awesome stuff like loading more content!
  }
}, 100);
*/
