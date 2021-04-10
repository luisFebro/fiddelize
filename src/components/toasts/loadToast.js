import StartToastifyInstance from "./toastifyEs";
import "./toastify.css";
// import { runToast } from "./toastify";

export default function loadToast(title, options = {}) {
    let { type } = options;
    if (!type) {
        type = "warning";
    }

    const buttonRequirement =
        options.onClick && options.needActionBtn && options.actionBtnText;
    if (options.needActionBtn) {
        if (!buttonRequirement)
            throw new Error("Button requires onClick and actionBtnText, too");
    }

    const toastTypes = ["warning", "success", "error"];
    if (!toastTypes.includes(type))
        throw new Error(`Invalid toastTypes. Only ${toastTypes}`);

    const imgHandlingCond =
        options.avatar && options.avatar.includes(".") ? options.avatar : ""; // ${CLIENT_URL}/icons/android-chrome-256x256.png

    StartToastifyInstance({
        text: buttonRequirement ? title : `${title} ${getToastIcon(type)}`,
        node: false,
        duration: handleDuration(options.dur),
        className: "toastify",
        fontWeight: "bolder",
        avatar: !options.avatar ? "" : imgHandlingCond,
        close: !options.close,
        gravity: options.gravity || "bottom",
        position: options.position || "left",
        background: handleToastColor(type), // dark blue,
        stopOnFocus: true, // Prevents dismissing of toast on hover
        onClick: options.onClick || function () {}, // Callback after click
        needActionBtn: options.needActionBtn === true,
        actionBtnText: options.actionBtnText,
    }).showToast();
}

// HELPERS
function handleToastColor(type) {
    if (type === "warning") return "#34495e";
    if (type === "success") return "green";
    if (type === "error") return "var(--mainRed)";

    return "#34495e";
}

function handleDuration(dur) {
    // -1 for permanent display
    if (dur === "forever") return -1;

    const DEFAULT_DUR = 7000;
    return dur || DEFAULT_DUR;
}

function getToastIcon(type) {
    const variantIcon = {
        success: "✨",
        warning: "☑️",
        error: "❎",
    };

    return variantIcon[type];
}
// END HELPERS
