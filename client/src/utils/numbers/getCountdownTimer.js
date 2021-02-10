// for seconds like 30s, use 0.5
export default function getCountdownTimer({ dur, elem, stop, overCallback }) {
    if (!elem) return console.log("no DOM elem parameter");
    if (typeof dur !== "number")
        return console.log("ERROR: dur should be a number");
    dur = 60 * dur;

    let timer = dur,
        minutes,
        seconds;

    const running = setInterval(function () {
        minutes = parseInt(timer / 60, 10); // n1 the second argument - radix - base number
        seconds = parseInt(timer % 60, 10);

        if (seconds <= 9) {
            seconds = `0${seconds}`;
        }

        if (seconds === 0) {
            seconds = "00";
        }

        elem.textContent = minutes + ":" + seconds; // n2
        // console.log(minutes + ":" + seconds)

        if (--timer < 0) {
            timer = 0;
        }
    }, 1000);

    if (stop) clearInterval(running);

    setTimeout(() => {
        const isFunc = typeof overCallback === "function";
        clearInterval(running);
        if (isFunc) overCallback(true);
    }, dur * 1000 + 2000); // 2000 to be sure it will be until zero...
}

/* COMMENTS
n1:
radix Optional
An integer between 2 and 36 that represents the radix (the base in mathematical numeral systems) of the string. Be careful—this does not default to 10! If the radix value is not of the Number type it will be coerced to a Number
reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt

n2:
The textContent property sets or returns the text content of the specified node, and all its descendants.
If you set the textContent property, any child nodes are removed and replaced by a single Text node containing the specified string.
*/

// const res = getCountdownTimer({ dur: 16 });

/* DOM EXEMPLE
window.onload = function () {
    var fiveMinutes = 60 * 5,
        display = document.querySelector('#time');
    startTimer(fiveMinutes, display);
};

<body>
    <div>Registration closes in <span id="time"></span> minutes!</div>
</body>

*/
