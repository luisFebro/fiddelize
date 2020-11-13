import { useState, useEffect } from "react";
// import useAutoPlay from '../media/useAutoPlay';
import lStorage, { confettiPlayOp } from "../../utils/storage/lStorage";

const loadConfetti = async (command) => {
    const { getConfetti } = await import(
        "../../keyframes/animations-js/confetti/confetti" /* webpackChunkName: "confetti-anima-lazy" */
    );
    const confetti = getConfetti();

    if (command === "start") return confetti.start();
    if (command === "isRunning") return confetti.isRunning;
    if (command === "stop") return confetti.stop();
};

// options:
export default function useAnimateConfetti(options = {}) {
    const { trigger, showMoreComps } = options;

    const [runSound, setRunSound] = useState(false);

    // useAutoPlay("win-challenge--audio", { trigger: runSound, delay: 2500 })

    useEffect(() => {
        let cancel;
        const playConfettiAgain = lStorage("getItem", confettiPlayOp);

        const runConfetti = () => {
            if (!playConfettiAgain && trigger) {
                setRunSound(true);
                loadConfetti("start");
                lStorage("setItem", confettiPlayOp);
            } else {
                const condToStopConfetti =
                    loadConfetti("isRunning") && showMoreComps;
                if (condToStopConfetti) {
                    setTimeout(() => loadConfetti("stop"), 5000);
                }
            }
        };

        if (cancel) return;
        runConfetti();

        if (playConfettiAgain && !trigger) {
            lStorage("removeItem", confettiPlayOp); // returns null if no keys were found.
        }

        return () => {
            cancel = true;
            loadConfetti("stop");
        };
    }, [trigger, showMoreComps]);
}
