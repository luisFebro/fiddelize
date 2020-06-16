// preload, cache multimedia.
export default function convertBlobToData(blob, mediaElem) {
    if(!blob || !mediaElem) throw new Error("Missing arguments...")

    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function() {
        const str64Data = reader.result;
        mediaElem.src = str64Data;
    }
}