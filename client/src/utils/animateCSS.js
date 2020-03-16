// reference: https://github.com/daneden/animate.css
export default function animateCSS(element, animationName, speed = 'normal', callback) {
    const node = document.querySelector(element)
    node.classList.add('animated', animationName, speed)

    function handleAnimationEnd() {
        node.classList.remove('animated', animationName, speed)
        node.removeEventListener('animationend', handleAnimationEnd)

        if (typeof callback === 'function') callback()
    }

    node.addEventListener('animationend', handleAnimationEnd)
}