import { useEffect, useRef } from "react";
import showToast from "components/toasts";
import useDelay from "hooks/useDelay";
import extractStrData from "utils/string/extractStrData";

// start off qr code scanner
export default function useQrScanner() {
    // { stopTrigger } // stopTrigger not making the camera logo to disappear after usage...
    const readyDelay = useDelay(5000);
    const once = useRef(false);
    const onceCamMsg = useRef(false);

    useEffect(() => {
        if (!once.current) {
            addScannerSrc();
            return (once.current = true);
        }
        if (!window.jbScanner || !window.scannerDevices) return null;

        const gotCamera = Boolean(window.scannerDevices[0].deviceId);
        if (!gotCamera && !onceCamMsg.current) {
            showToast("Nenhuma câmera foi detectada em seu dispositivo.", {
                type: "error",
            });
            return (onceCamMsg.current = true);
        }

        return "ok";
    }, [readyDelay, once.current, onceCamMsg.current]);

    useEffect(() => {
        if (!window.jbScanner) return;
        // if (stopTrigger) window.jbScanner.stopScanning();
        // { stopTrigger }
    }, []);
}

// value e.g customer_pts::customerId:123;customerName:Luis Febro;
// the value is decrypted from Scanners components
// returns object
export const getScannedData = (value) => {
    if (!value) return null;
    if (typeof value !== "string")
        throw new Error("Value argument should be a string");

    const allowedValidators = ["customer_pts", "buy_games"];
    const gotDelimeter = value.includes("::");
    if (
        !gotDelimeter ||
        !allowedValidators.some((allowedValidator) =>
            value.includes(allowedValidator)
        )
    )
        throw new Error("Invalid Validator");

    const delimeterInd = value.indexOf("::");
    const VALIDATOR_IND = delimeterInd + 2; // 2 represents th delimeter length (::) to get the right value || length of customer_pts::
    const content = value.slice(VALIDATOR_IND);
    return extractStrData(content);
};

// HELPERS
function addScannerSrc() {
    const mainScripts = document.createElement("script");

    mainScripts.type = "text/javascript";
    mainScripts.src = "/qr-scanner/jsqrscanner.nocache.js";
    mainScripts.async = true;
    mainScripts.crossorigin = "anonymous";
    document.body.appendChild(mainScripts);

    // all methods
    const scriptMethods = document.createElement("script");

    scriptMethods.type = "text/javascript";
    scriptMethods.src = "/qr-scanner/scripts/run-scanner.js";
    scriptMethods.async = true;
    scriptMethods.crossorigin = "anonymous";
    document.body.appendChild(scriptMethods);
}
// END HELPERS
