// reference: https://stackoverflow.com/questions/454202/creating-a-textarea-with-auto-resize
import { useEffect } from "react";

export default function useAutoresizeableTextarea() {
    useEffect(() => {
        setAutoresizeableTextarea();
    }, []);
}

function setAutoresizeableTextarea() {
    const txtArea = document.getElementsByTagName("textarea");

    const defaultFieldSize = "45px";
    const deniedSizes = [0, 72]; // if the initial value is here, then default size

    for (let i = 0; i < txtArea.length; i++) {
        const scrollHeight = deniedSizes.includes(txtArea[i].scrollHeight)
            ? defaultFieldSize
            : txtArea[i].scrollHeight;

        txtArea[i].setAttribute(
            "style",
            "height:" + scrollHeight + "px;overflow-y:hidden;"
        );
        txtArea[i].addEventListener("input", onInput, false);
        txtArea[i].addEventListener("focus", onInput, false);
        txtArea[i].addEventListener("blur", onBlur, false);
    }

    function onInput() {
        this.style.placeholder = "Escreva sua mensagem";
        this.style.resize = "none";
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";
    }

    function onBlur() {
        setTimeout(() => {
            const gotSomeTxt = this.innerHTML;
            if (gotSomeTxt) return; // don't change the height if got some text

            this.style.height = defaultFieldSize;
        }, 1000); // a small delay to avoid conflict when clicking in sending. Otherwise, user will have to click twice to send text with spacing
    }

    // focus and place cursor at the end of text after loading the page
    window.addEventListener("load", () => {
        setTimeout(() => {
            const thisTxtArea = document.querySelector(".msg-sender");
            if (thisTxtArea) thisTxtArea.focus();
            thisTxtArea.addEventListener("load", placeCursorAtEnd);
        }, 1600);
    });
}

// HELPERS
// reference: https://stackoverflow.com/questions/4331022/focus-input-box-on-load
function placeCursorAtEnd() {
    if (this.setSelectionRange) {
        // Double the length because Opera is inconsistent about
        // whether a carriage return is one character or two.
        var len = this.value.length * 2;
        this.setSelectionRange(len, len);
    } else {
        // This might work for browsers without setSelectionRange support.
        this.value = this.value;
    }

    if (this.nodeName === "TEXTAREA") {
        // This will scroll a textarea to the bottom if needed
        this.scrollTop = 999999;
    }
}
// END HELPERS
