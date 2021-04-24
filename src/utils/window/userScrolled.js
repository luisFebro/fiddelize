//  check if the user start scrolling the page...
// callback is required to display the result.
//  it should have a true value as result.

export default function userScrolled(callback) {
    const watchScroll = () => {
        const movedScroll = window.scrollY;

        if (!movedScroll) return false;

        window.onscroll = null;
        if (typeof callback === "function") {
            return callback();
        }
    };

    window.addEventListener("scroll", watchScroll);
}
