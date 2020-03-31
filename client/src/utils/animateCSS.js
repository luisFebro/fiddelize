// reference: https://github.com/daneden/animate.css
// WARNING: use e.target to get the nodeElement such as e => handleFlip(e), then e.target
// In case of icon from font awesome, use e.target.parentElement to point to svg element instead of path...
export default function animateCSS(element, animationName, speed = 'normal', callback) {
    const node = element;
    node.classList.add('animated', animationName, speed)

    function handleAnimationEnd() {
        node.classList.remove('animated', animationName, speed)
        node.removeEventListener('animationend', handleAnimationEnd)

        if (typeof callback === 'function') callback()
    }

    node.addEventListener('animationend', handleAnimationEnd)
}