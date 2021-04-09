import StartToastifyInstance from "./toastifyEs";
import "./toastify.css";
// import { runToast } from "./toastify";

export default function showVanillaToast(title, options = {}) {
    options.close = true;
    options.type = "warning";

    const toastTypes = ["warning", "success", "error"];
    if (!toastTypes.includes(options.type))
        throw new Error(`Invalid toastTypes. Only ${toastTypes}`);

    const imgHandlingCond =
        options.avatar && options.avatar.includes(".") ? options.avatar : ""; // ${CLIENT_URL}/icons/android-chrome-256x256.png

    StartToastifyInstance({
        text: title || "I am the the toast message",
        duration: handleDuration(options.dur),
        className: "toastify",
        fontWeight: "bolder",
        avatar: !options.avatar ? "" : imgHandlingCond,
        close: options.close === true,
        gravity: options.gravity || "bottom",
        position: options.position || "left",
        background: handleToastColor(options.type), // dark blue,
        stopOnFocus: true, // Prevents dismissing of toast on hover
        onClick: options.onClick || function () {}, // Callback after click
        needActionBtn: options.needActionBtn === true,
        actionBtnText: options.actionBtnText,
    }).showToast();
}

// HELPERS
function handleToastColor(type) {
    if (type === "warning") return "#34495e";
    if (type === "success") return "var(--incomeGreen)";
    if (type === "error") return "var(--mainRed)";
}

function handleDuration(dur) {
    // -1 for permanent display
    if (dur === "forever") return -1;

    const DEFAULT_DUR = 10000;
    return dur || DEFAULT_DUR;
}
// END HELPERS
