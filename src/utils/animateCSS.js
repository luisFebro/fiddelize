// reference: https://github.com/daneden/animate.css
// WARNING: use e.target to get the nodeElement such as e => handleFlip(e), then e.target
// In case of icon from font awesome, use e.target.parentElement to point to svg element instead of path...
// for exiting transition animation, only zoomOut seems to work at the moment.
export default function animateCSS(
    element,
    animationName,
    speed = "normal",
    callback = () => null,
    needQuerySelector
) {
    const node = needQuerySelector ? document.querySelector(element) : element;
    node.classList.add("animated", animationName, speed);

    function handleAnimationEnd() {
        node.style = "animation-direction: forwards;";
        node.classList.remove("animated", animationName, speed);
        node.removeEventListener("animationend", handleAnimationEnd);

        if (typeof callback === "function") callback();
    }

    node.addEventListener("animationend", handleAnimationEnd);
}
