// reference https://github.com/jbialobr/JsQRScanner
import { useEffect, useState } from "react";
import Field from "components/fields";
import useBackColor from "hooks/useBackColor";
import { useBizData } from "init";
import removeImgFormat from "utils/biz/removeImgFormat";
import useDelay from "hooks/useDelay";
import showToast from "components/toasts";
import { prerenderAudio, playAudio } from "hooks/media/usePlayAudio";

export default function QrScanner() {
    const [newScannedTxt, setNewScannedTxt] = useState("");
    console.log("newScannedTxt", newScannedTxt);
    const { themePColor, bizLogo } = useBizData();

    const readyDelay = useDelay(5000);
    useBackColor(`var(--themePDark--${themePColor})`);

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

    const handleNewScannedTxt = (newText) => {
        playAudio("audio_cli-staff_scanner-beep");
        showToast(`Novo Código QR: ${newText}`, {
            type: "success",
            dur: 10000,
        });
    };

    useEffect(() => {
        if (newScannedTxt) handleNewScannedTxt(newScannedTxt);
    }, [newScannedTxt]);

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
            <main className="scanner--root mb-5">
                <div id="scanner" />
                <style jsx global>
                    {`
                        .scanner--root #scanner {
                            display: flex;
                            justify-content: center;
                        }

                        .qrPreviewVideo {
                            background: ${`var(--themePDark--${themePColor})`};
                            max-width: 95%;
                            max-height: 60%;
                        }
                    `}
                </style>
            </main>
            <form>
                <Field
                    id="scannedTxt"
                    textAlign="text-center"
                    size="medium"
                    multiline
                    rows={3}
                    name="scannedTxt"
                    value="qr result will appear here"
                    onChangeCallback={setNewScannedTxt}
                />
            </form>
        </section>
    );
}

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

function readScannerProps() {
    const jsScanner = window.jbScanner;

    jsScanner.setScanInterval(900); // default set to 300
    const scanInterval = jsScanner.getScanInterval();
    const snapImageMaxSize = jsScanner.getSnapImageMaxSize();
    const isActive = jsScanner.isActive();
    const isScanning = jsScanner.isScanning();

    return {
        scanInterval,
        snapImageMaxSize,
        isActive,
        isScanning,
    };
}

async function setScannerBeep() {
    await prerenderAudio(
        "/sounds/scanner-beep.mp3",
        "audio_cli-staff_scanner-beep"
    );
}
/*
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
