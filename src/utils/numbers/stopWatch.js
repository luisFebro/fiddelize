let sec = 0;
let min = 0;

let timeSecs;
let time;
let timingSeconds = 0;

const runTimer = (el) => {
    if (sec === 60) {
        min++;
        sec = 0;
    }

    if (min === 60) sec, (min = 0);

    // Doing some string interpolation
    let hour = "00";
    let seconds = sec < 10 ? `0` + sec : sec;
    let minute = min < 10 ? `0` + min : min;

    let timer = `${hour}:${minute}:${seconds}`;
    el.innerHTML = timer;
};

export default function stopWatch(action, { stopwatchElem }) {
    const actionList = ["start", "stop", "reset"];
    if (!stopwatchElem) return null;
    if (!actionList.includes(action)) throw new Error("Invalid action");

    // start stopwatch
    if (action === "start") {
        timeSecs = setInterval(() => {
            timingSeconds++;
        }, 1000);
        time = setInterval(() => runTimer(stopwatchElem), 10);

        return {
            date: null,
            timingSeconds: null,
        };
    }

    // stop stopwatch
    if (action === "stop") {
        clearInterval(time);
    }

    if (action === "reset" || action === "empty") {
        sec = 0;
        min = 0;

        stopwatchElem.innerHTML = `00:00:00`;

        return {
            disconnectedDate: new Date(),
            timingSeconds,
        };
    }
}
