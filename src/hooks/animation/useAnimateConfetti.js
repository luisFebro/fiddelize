import { useState, useEffect } from "react";
import getItems, { setItems, removeItems } from "init/lStorage";
import { removeVar } from "init/var";
import usePlayAudio from "hooks/media/usePlayAudio";

const localCollection = "onceChecked";

const loadConfetti = async (command) => {
    const { getConfetti } = await import(
        "./confetti" /* webpackChunkName: "confetti-anima-lazy" */
    );
    const confetti = getConfetti();

    if (command === "start") return confetti.start();
    if (command === "isRunning") return confetti.isRunning;
    if (command === "stop") return confetti.stop();

    return null;
};

// options:
export default function useAnimateConfetti(options = {}) {
    const { trigger, maxTimeSec, showMoreComps } = options;

    const [runSound, setRunSound] = useState(false);

    usePlayAudio(null, "audio-client-won-benefit", {
        autoplay: true,
        trigger: trigger && runSound,
    });

    useEffect(() => {
        let cancel;
        const [playConfettiAgain] = getItems(localCollection, ["confettiPlay"]);

        const runConfetti = () => {
            if (!playConfettiAgain && trigger) {
                setRunSound(true);
                loadConfetti("start");
                setItems(localCollection, { confettiPlay: true });
            } else {
                // const condToStopConfetti =
                //     loadConfetti("isRunning") && showMoreComps;
                setTimeout(() => loadConfetti("stop"), 20000);
            }
        };

        if (cancel) return;
        runConfetti();

        if (playConfettiAgain && !trigger) {
            removeItems(localCollection, ["confettiPlay"]);
        }

        if (trigger && maxTimeSec) {
            setRunSound(true);
            loadConfetti("start");
            setTimeout(() => {
                loadConfetti("stop");
            }, maxTimeSec);
        }

        removeVar("didBeatGame");
        // return () => {
        //     cancel = true;
        //     loadConfetti("stop");
        // };
    }, [trigger, showMoreComps, maxTimeSec]);
}
