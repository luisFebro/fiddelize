import { useRef, useEffect } from "react";
import convertBlobToData from '../../utils/media/convertBlobToData';

// cache and play audio easily and surely after loading a page.
// mediaElem should be prefix (# id or . class) + componentName + mediaType to avoid conflicts...
export default function usePlayAudio(url, mediaElem) {
    useEffect(() => {
        const audio = new Audio();
        const mediaBtn = document.querySelector(mediaElem);

        mediaBtn.addEventListener("click", () => audio.play());

        fetch(url)
        .then(response => response.blob())
        .then(blob => convertBlobToData(blob, audio))
        .catch(err => console.log(err))
    }, [])
};