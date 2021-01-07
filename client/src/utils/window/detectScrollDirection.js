// reference: https://stackoverflow.com/questions/31223341/detecting-scroll-direction
import throttle from "../performance/throttle";

export default function detectScrollDirection(callback) {
    let lastScroll = 0;

    const wait = 300;

    window.onscroll = throttle(function () {
        // LESSON
        const scrollResult = checkScroll();
        callback(scrollResult);
    }, wait);

    function checkScroll() {
        const currentScroll =
            document.documentElement.scrollTop || document.body.scrollTop; // Get Current Scroll Value

        if (currentScroll > 0 && lastScroll <= currentScroll) {
            // scrolling downward
            lastScroll = currentScroll;
            return false;
        } else {
            // scrolling upward
            lastScroll = currentScroll;
            return true;
        }
    }
}
