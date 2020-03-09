// reference: https://stackoverflow.com/questions/16994662/count-animation-from-number-a-to-b
import getDecimalPart from './getDecimalPart';
import { convertDotToComma } from './convertDotComma';
// e. g
// animateNumber(
//     animatedNumber.current,
//     0,
//     cashCurrentScore,
//     3000,
//     setShowTotalPoints
// );
export default function animateNumber(ref, start, end, duration, next) {
    start = parseFloat(start);
    end = parseFloat(end);

    var obj = ref;

    if(!obj) {
        //next(true); n1
        return;
    }

    if(end === 0 || !end) {
        obj.innerHTML = 0;
        next(true);
        return;
    };

    var range = end - start;
    var current = start;
    var increment = end > start ? 1 : -1;
    var stepTime = Math.abs(Math.floor(duration / range));
    var timer = setInterval(function() {
        current += increment;
        obj.innerHTML = current;
        if(current >= end) {
            const isInteger = Number.isInteger(parseFloat(end));
            const finalNumber = Math.floor(end) + parseFloat(getDecimalPart(end));
            if(!isInteger) { obj.innerHTML = convertDotToComma(finalNumber) }

            clearInterval(timer);
            next(true);
        }
    }, stepTime);
}

// the lowest the score, the more delay it will have.
const getAnimationDuration = score => {
    if(typeof score === 'object') return 0;
    if(!(['number', 'undefined']).includes(typeof score)) throw new Error("Primary type should be a number or empty. Not " + typeof score);

    let animaDuration;
    if(score <= 100) {
        animaDuration = 3500;
    } else if (score >= 100 && score <= 200) {
        animaDuration = 3000;
    } else if (score >= 200 && score <= 300) {
        animaDuration = 2500;
    } else if (score >= 300 && score <= 400) {
        animaDuration = 2000;
    } else {
        animaDuration = 1000;
    }

    return animaDuration;
}

export { getAnimationDuration }


/* COMMENTS
n1: this is commented out because this next function triggers other components untimely
*/