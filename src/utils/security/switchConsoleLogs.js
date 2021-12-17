import { IS_DEV } from "../../config/clientUrl";
// reference: https://stackoverflow.com/questions/1215392/how-to-quickly-and-conveniently-disable-all-console-log-statements-in-my-code

// This allow console.log only on development environment and disabled otherwise.
export default function switchConsoleLogs() {
    const debug = true; //IS_DEV;

    if (debug === false) {
        if (typeof window.console === "undefined") {
            window.console = {};
        }
        window.console.log = function () {};
    }
}
