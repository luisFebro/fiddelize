// The txt Element should be a string like:
// <input type="text" class="endResultColor" value="Current CSS Background" >
export default function copyTextToClipboard(txtElem, callback) {
    if(!txtElem) throw new Error("txtElem argument is missing...");

    const textArea = document.querySelector(txtElem);

    if(textArea) { textArea.select(); }
    document.execCommand("copy");

    if(typeof callback === "function") {
        callback();
    }
}