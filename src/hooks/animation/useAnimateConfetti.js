import { useState, useEffect } from "react";
import usePlayAudio from "../../hooks/media/usePlayAudio";
import { setItems, getItems, removeItems } from "init/lStorage";

const localCollection = "onceChecked";

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

    usePlayAudio(null, "audio-client-won-prize", {
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
            removeItems(localCollection, ["confettiPlay"]);
        }

        return () => {
            cancel = true;
            loadConfetti("stop");
        };
    }, [trigger, showMoreComps]);
}
