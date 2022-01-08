import { useEffect } from "react";
import getVar from "init/var";
import convertBlobToData from "utils/media/convertBlobToData";

// For prerender audio when we need to use the mediaElem name twice, one to prerender the audio and to actually play it.
// to use programmatically.
export const prerenderAudio = async (url, mediaName) => {
    const response = await fetch(url);
    const blob = await response.blob();

    return await convertBlobToData(blob, {
        mediaName,
    }).catch((err) => console.log(err));
};

export const usePrerenderAudio = (path, audioName = "audio_") => {
    useEffect(() => {
        if (!path || !audioName) return;
        prerenderAudio(path, audioName);
    }, [path, audioName]);
};

// cache and play audio easily and surely after loading a page.
// mediaElem should be prefix (# id or . class) + componentName + mediaType to avoid conflicts...
// trigger (bool) condition to play audio
export default function usePlayAudio(url, mediaElem, options = {}) {
    const { multi, autoplay = false, onendedCallback } = options;
    let { delay, trigger } = options;

    if (!delay) delay = 0;
    if (typeof trigger !== "boolean" && trigger !== null) trigger = true;

    const getSingleElem = (audio) => {
        const mediaBtn = document.querySelector(mediaElem);
        console.log(`audio set on ${mediaElem}`);
        if (mediaBtn) mediaBtn.addEventListener("click", () => audio.play());
    };

    const getMultiElems = (audio) => {
        const groupElems = document.querySelectorAll(mediaElem);
        console.log(`audio set as MULTI on ${mediaElem}`);
        if (groupElems) {
            groupElems.forEach((elem) => {
                elem.addEventListener("click", () => audio.play());
            });
        }
    };

    useEffect(() => {
        const audio = new Audio();
        audio.src = url;

        if (!autoplay && trigger) {
            if (multi) getMultiElems(audio);
            else getSingleElem(audio);
        }

        // In order to use autoplay and to have the audio playing instantly, first we need to prerender the audio in the page or component
        // before setting the name when the data will be stored on indexedDB
        // usePlayAudio("/sounds/audio.mp3", ".class-name-audio", { prerender: true })
        if (autoplay && trigger) {
            // audio.volume = "0.2"
            (async () => {
                const audioSrc = await getVar(mediaElem, "audios");
                if (!audioSrc)
                    return console.log(
                        `ISSUE: the media ${mediaElem.toUpperCase()} was not found in indexedDB. Check if you prerender the audio first in string64 format before using the audio.`
                    );
                audio.src = audioSrc;
                setTimeout(() => audio.play(), delay);
            })();
        }

        if (typeof onendedCallback === "function") {
            audio.addEventListener("ended", () => {
                onendedCallback();
            });
        }
    }, [multi, trigger, autoplay]);
}

// for programatic play
export const playAudio = async (mediaName) => {
    const audioSrc = await getVar(mediaName, "audios");
    if (!audioSrc)
        return console.log(
            `ISSUE: the media ${mediaName.toUpperCase()} was not found in indexedDB. Check if you prerender the audio first in string64 format before using the audio.`
        );

    const audio = new Audio();
    audio.src = audioSrc;
    return audio.play();
};
