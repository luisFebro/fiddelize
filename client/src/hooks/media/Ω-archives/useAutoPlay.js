import { useEffect } from 'react';
// GOAL: auto play media, a sound.
// trigger to check whether or not play the audio.
// play audio right on start set onLoad (boolean)
// e.g
// set audio like: usePlayAudio("/sounds/cornet-and-applauses.mp3", ".win-challenge--audio", { storeAudioTo: "win-challenge--audio" })
// get audio like  useAutoPlay("win-challenge--audio", { trigger: true, delay: 4000 })
export default function useAutoPlay(mediaName, options = {}) {
    if(!mediaName) throw new Error("You should include a media name");

    const { trigger, onLoad } = options;
    let { delay } = options;
    if(!delay) delay = 0;

    useEffect(() => {
        let cancel = false;
        if(trigger) {
            const audio = new Audio();
            audio.volume = "0.2"

            if(cancel) return;

            const audioSrc = localStorage.getItem(mediaName);
            if(!audioSrc) return console.log(`ISSUE: the media ${mediaName.toUpperCase()} was not found in storage. Check for mispellings or make sure to set the audio in string64 format before using this.`)

            audio.src = audioSrc;

            onLoad
            ? window.onload = () => setTimeout(() => audio.play(), delay)
            : setTimeout(() => audio.play(), delay)
        }

        return () => { cancel = true }
    }, [trigger, onLoad])
}