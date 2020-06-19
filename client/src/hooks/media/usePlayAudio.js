import { useRef, useEffect } from "react";
import convertBlobToData from '../../utils/media/convertBlobToData';

// cache and play audio easily and surely after loading a page.
// mediaElem should be prefix (# id or . class) + componentName + mediaType to avoid conflicts...
// trigger (bool) condition to play audio
export default function usePlayAudio(url, mediaElem, options = {}) {
    const { multi } = options;
    let { storeAudioTo, delay, trigger } = options;
    if(!delay) delay = 0;
    if(typeof trigger !== "boolean") trigger = true;

    const getSingleElem = audio => {
        const mediaBtn = document.querySelector(mediaElem);
        console.log(`audio set on ${mediaElem}`)
        mediaBtn && mediaBtn.addEventListener("click", () => audio.play());
    }

    const getMultiElems = audio => {
        const groupElems = document.querySelectorAll(mediaElem);
        if(groupElems) {
            groupElems.forEach(elem => elem.addEventListener("click", () => audio.play()))
        }
    }

    useEffect(() => {
        const audio = new Audio();

        if(trigger) {
            multi ? getMultiElems(audio) : getSingleElem(audio);

            fetch(url)
            .then(response => response.blob())
            .then(blob => setTimeout(() => convertBlobToData(blob, audio, { storeAudioTo }), delay))
            .catch(err => console.log(err))
        }

    }, [multi, trigger])
};