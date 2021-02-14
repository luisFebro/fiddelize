import { useEffect } from "react";
import convertBlobToData, {
    convertBlobToDataAsync,
} from "../../utils/media/convertBlobToData";
import { getVar, store } from "../storage/useVar";

// For prerender audio when we need to use the mediaElem name twice, one to prerender the audio and to actually play it.
// export const store = {
//     "cli-member"
// };
// to use programmatically.
export const prerenderAudio = async (url, mediaName, options = {}) => {
    const response = await fetch(url);
    const blob = await response.blob();

    return await convertBlobToDataAsync(blob, {
        prerender: true,
        mediaName,
    }).catch((err) => console.log(err));
};

// cache and play audio easily and surely after loading a page.
// mediaElem should be prefix (# id or . class) + componentName + mediaType to avoid conflicts...
// trigger (bool) condition to play audio
// if prerender and autoplay, mediaElem will be a name instead of an element
export default function usePlayAudio(url, mediaElem, options = {}) {
    let {
        prerender,
        delay,
        trigger,
        multi,
        autoplay = false,
        onendedCallback,
    } = options;

    if (!delay) delay = 0;
    if (typeof trigger !== "boolean") trigger = true;

    const getSingleElem = (audio) => {
        const mediaBtn = document.querySelector(mediaElem);
        console.log(`audio set on ${mediaElem}`);
        mediaBtn && mediaBtn.addEventListener("click", () => audio.play());
    };

    const getMultiElems = (audio) => {
        const groupElems = document.querySelectorAll(mediaElem);
        console.log(`audio set as MULTI on ${mediaElem}`);
        if (groupElems) {
            groupElems.forEach((elem) =>
                elem.addEventListener("click", () => audio.play())
            );
        }
    };

    useEffect(() => {
        const audio = new Audio();

        if (!autoplay) {
            if (trigger) {
                multi ? getMultiElems(audio) : getSingleElem(audio);

                fetch(url)
                    .then((response) => response.blob())
                    .then((blob) =>
                        setTimeout(
                            () =>
                                convertBlobToData(blob, {
                                    prerender,
                                    audio,
                                    mediaName: mediaElem,
                                }),
                            delay
                        )
                    )
                    .catch((err) => console.log(err));
            }
        }

        // In order to use autoplay and to have the audio playing instantly, first we need to prerender the audio in the page or component
        // before setting the name when the data will be stored on indexedDB
        // usePlayAudio("/sounds/audio.mp3", ".class-name-audio", { prerender: true })
        if (autoplay) {
            if (trigger) {
                // audio.volume = "0.2"

                (async () => {
                    const audioSrc = await getVar(mediaElem, store.audios);
                    if (!audioSrc)
                        return console.log(
                            `ISSUE: the media ${mediaElem.toUpperCase()} was not found in indexedDB. Check if you prerender the audio first in string64 format before using the audio.`
                        );
                    audio.src = audioSrc;
                    setTimeout(() => audio.play(), delay);
                })();
            }
        }

        if (typeof onendedCallback === "function") {
            audio.addEventListener("ended", () => {
                onendedCallback();
            });
        }
    }, [multi, trigger, autoplay]);
}
