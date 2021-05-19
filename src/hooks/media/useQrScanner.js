import { useEffect, useRef } from "react";
import showToast from "components/toasts";
import useDelay from "hooks/useDelay";

// start off qr code scanner
export default function useQrScanner() {
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
}

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
