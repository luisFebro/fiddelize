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

    for (let i = 0; i < txtArea.length; i++) {
        const scrollHeight =
            txtArea[i].scrollHeight === 0
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
            this.style.height = defaultFieldSize;
        }, 1000); // a small delay to avoid conflict when clicking in sending. Otherwise, user will have to click twice to send text with spacing
    }
}
