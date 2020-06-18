import { useRef, useEffect } from "react";
import convertBlobToData from '../../utils/media/convertBlobToData';

// cache and play audio easily and surely after loading a page.
// mediaElem should be prefix (# id or . class) + componentName + mediaType to avoid conflicts...
export default function usePlayAudio(url, mediaElem, options = {}) {
    const { multi } = options;

    const getSingleElem = audio => {
        const mediaBtn = document.querySelector(mediaElem);
        console.log("audio set")
        mediaBtn.addEventListener("click", () => audio.play());
    }

    const getMultiElems = audio => {
        const groupElems = document.querySelectorAll(mediaElem);
        if(groupElems) {
            groupElems.forEach(elem => elem.addEventListener("click", () => audio.play()))
        }
    }

    useEffect(() => {
        const audio = new Audio();

        multi ? getMultiElems(audio) : getSingleElem(audio);

        fetch(url)
        .then(response => response.blob())
        .then(blob => convertBlobToData(blob, audio))
        .catch(err => console.log(err))
    }, [])
};