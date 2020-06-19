// preload, cache multimedia.
export default function convertBlobToData(blob, mediaElem, options = {}) {
    const { storeAudioTo } = options;

    if(!blob || !mediaElem) throw new Error("Missing arguments...")

    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function() {
        const str64Data = reader.result;
        if(storeAudioTo) {
            localStorage.setItem(storeAudioTo, str64Data)
        } else {
            mediaElem.src = str64Data;
        }
    }
}