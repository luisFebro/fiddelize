import { setVar, store } from "../../hooks/storage/useVar";
// preload, cache multimedia.
export default function convertBlobToData(blob, options = {}) {
    const { prerender, audio, mediaName } = options;

    if (!blob || !mediaName) throw new Error("Missing arguments...");

    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
        const str64Data = reader.result;
        if (prerender) {
            setVar({ [mediaName]: str64Data }, store.audios);
        } else {
            audio.src = str64Data;
        }
    };
}

export const convertBlobToDataAsync = async (blob, options = {}) => {
    const { prerender, audio, mediaName } = options;

    if (!blob || !mediaName) throw new Error("Missing arguments...");

    const filePromise = async (resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);

        reader.onerror = () => {
            reader.abort();
            reject(new DOMException("Problem parsing input file."));
        };

        reader.onloadend = async function () {
            const str64Data = reader.result;
            await setVar({ [mediaName]: str64Data }, store.audios);
            resolve(`card set to ${mediaName} successfully`);
        };
    };

    return new Promise(filePromise);
};
