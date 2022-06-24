let h = 0;
let sec = 0;
let min = 0;
let ms = 0;

let timeSecs;
let time;
let timingSeconds = 0;

const runTimer = (el) => {
    ms += 1;
    if (ms >= 100) {
        sec += 1;
        ms = 0;
    }

    if (min === 60) {
        h += 1;
        min = 1;
    }

    if (sec === 60) {
        min += 1;
        sec = 0;
    }

    if (min === 60) {
        sec, (min = 0);
    }

    // Doing some string interpolation
    const hour = h < 10 ? `0${h}` : h;
    const seconds = sec < 10 ? `0${sec}` : sec;
    const minute = min < 10 ? `0${min}` : min;

    const timer = `${hour}:${minute}:${seconds}`;
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
        clearInterval(timeSecs);
    }

    if (action === "reset") {
        sec = 0;
        min = 0;

        stopwatchElem.innerHTML = `00:00:00`;

        return {
            disconnectedDate: new Date(),
            timingSeconds: null,
        };
    }

    return {};
}
