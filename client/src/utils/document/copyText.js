// copy text to clipboard without a visible input field
// https://stackoverflow.com/questions/50795042/create-a-copy-button-without-an-input-text-box
export default function copyText(txt, callback) {
    if (!txt) throw new Error("txt argument is missing...");

    const tempInput = document.createElement("input");
    tempInput.value = txt;
    document.body.appendChild(tempInput);
    tempInput.select();

    document.execCommand("copy");
    document.body.removeChild(tempInput);

    if (typeof callback === "function") {
        callback();
    }
}
