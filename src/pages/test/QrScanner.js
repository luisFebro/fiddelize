// reference https://github.com/jbialobr/JsQRScanner
import { useEffect, useState } from "react";
import useBackColor from "hooks/useBackColor";
import { useBizData } from "init";
import removeImgFormat from "utils/biz/removeImgFormat";
import useDelay from "hooks/useDelay";
import showToast from "components/toasts";
import { prerenderAudio, playAudio } from "hooks/media/usePlayAudio";

export default function QrScanner() {
    const [history, setHistory] = useState([]);
    const { themePColor, bizLogo } = useBizData();

    useBackColor(`var(--themePDark--${themePColor})`);

    const readyDelay = useDelay(5000);
    const timer = useUpdater();

    async function handleNewScannedTxt(newText) {
        await playAudio("audio_cli-staff_scanner-beep");
        await playAudio("audio_cli-staff_detected-receipt");
        showToast(`Novo Código QR: ${newText}`, {
            type: "success",
            dur: 10000,
        });
    }

    useEffect(() => {
        const newScannedText = window.scannedText;
        if (!newScannedText) return null;

        const alreadyScanned = history.includes(newScannedText);
        if (alreadyScanned) return null;

        setHistory((prev) => [...new Set([...prev, newScannedText])]);

        const allowedScans = [
            "discountBack",
            "targetPrize",
            "raffleTicket",
            "topCustomers",
        ];
        const isNotAllowed = !allowedScans.some((game) =>
            newScannedText.includes(game)
        );
        if (isNotAllowed)
            return showToast(
                "Código QR detectado não é um comprovante de benefício",
                { type: "error" }
            );

        return handleNewScannedTxt(newScannedText);
        // eslint-disable-next-line
    }, [timer]);

    const { newImg, width, height } = removeImgFormat(bizLogo);

    useEffect(() => {
        if (!window.jbScanner) return addScannerSrc();
        if (!window.scannerDevices) return null;
        setScannerBeep();

        const gotCamera = Boolean(window.scannerDevices[0].deviceId);
        if (!gotCamera)
            return showToast(
                "Nenhum câmera foi detectada em seu dispositivo.",
                { type: "error" }
            );

        return "ok";
    }, [readyDelay]);

    return (
        <section className="text-white text-shadow">
            <section className="container-center-col">
                <img src={newImg} width={width} height={height} alt="logo" />
                <h1 className="mt-5 text-subtitle font-weight-bold text-center">
                    Registro
                    <br />
                    comprovante digital
                </h1>
                <p className="mb-5 text-normal text-center">
                    Escaneie o código QR no comprovante do cliente.
                </p>
            </section>
            <main id="scanner" className="mb-5">
                <style jsx global>
                    {`
                        .qrPreviewVideo {
                            background: grey;
                            //width: 350px;
                            //height: 350px;
                            width: 100%;
                            //max-height: 70%;
                        }
                    `}
                </style>
            </main>
        </section>
    );
}

function useUpdater(timeSpan = 1000) {
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        const runTime = setInterval(() => {
            setTimer((prev) => prev + 1);
        }, timeSpan);

        return () => {
            clearInterval(runTime);
        };
    }, [timeSpan]);

    return timer;
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

async function setScannerBeep() {
    await Promise.all([
        prerenderAudio(
            "/sounds/tts/scanner-beep/beep.mp3",
            "audio_cli-staff_scanner-beep"
        ),
        prerenderAudio(
            "/sounds/tts/scanner-beep/detected-receipt.mp3",
            "audio_cli-staff_detected-receipt"
        ),
    ]);
}
// END HELPERS

// function readScannerProps() {
//     const jsScanner = window.jbScanner;

//     jsScanner.setScanInterval(900); // default set to 300
//     const scanInterval = jsScanner.getScanInterval();
//     const snapImageMaxSize = jsScanner.getSnapImageMaxSize();
//     const isActive = jsScanner.isActive();
//     const isScanning = jsScanner.isScanning();

//     return {
//         scanInterval,
//         snapImageMaxSize,
//         isActive,
//         isScanning,
//     };
// }

/* ARCHIVES
<section className="container-center">
    <main
        id="scanner"
        className="scanner font-weight-bold text-shadow text-normal text-center text-white"
    >
        Iniciando Câmera...
    </main>
    <style jsx>
        {`
            .scanner {
                background: grey;
                padding-top: 200px;
                width: 300px;
                height: 400px;
            }
        `}
    </style>
</section>
 */
