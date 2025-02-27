import { useEffect, useState } from "react";
import removeImgFormat from "utils/biz/removeImgFormat";
import { useBizData } from "init";
import useQrScanner from "hooks/media/useQrScanner";
import showToast from "components/toasts";
import { prerenderAudio, playAudio } from "hooks/media/usePlayAudio";
import getVar, { setVar } from "init/var";
import CameraQrScannerGuide from "../../../CameraQrScannerGuide";
// import { decrypt } from "utils/security/xCipherFront";

export default function PointsScanner({ closeModal, callback }) {
    const { bizLogo } = useBizData();
    const [stop, setStop] = useState(false);

    useQrScanner({ stopTrigger: stop });
    const timer = useUpdater();

    useEffect(() => {
        setScannerBeep();
        setStop(false);
    }, []);

    useEffect(() => {
        const scanValidator = "customer_pts::";

        (async () => {
            const newScannedText = window.scannedText;
            const priorScannedText = await getVar("qrCodePtsLastTxt");
            const alreadyScanned =
                newScannedText && newScannedText === priorScannedText;
            if (!newScannedText || alreadyScanned) return null;

            await setVar({ qrCodePtsLastTxt: newScannedText });

            const isNotAllowed = !newScannedText.includes(scanValidator);
            if (isNotAllowed)
                return showToast(
                    "Código QR detectado não é válido para ler dados do cliente",
                    { type: "error" }
                );

            playAudio("audio_cli-staff_scanner-beep").then(() => {
                setStop(true);
                callback(newScannedText);
                closeModal();
            });

            return null;
        })();
        // eslint-disable-next-line
    }, [timer]);

    const showTitle = () => {
        const { newImg, width, height } = removeImgFormat(bizLogo);
        return (
            <section className="container-center-col">
                <img src={newImg} width={width} height={height} alt="logo" />
                <h1 className="mt-5 text-subtitle font-weight-bold text-center">
                    Encontre cliente com código QR
                </h1>
                <p className="mb-5 mx-2 text-normal text-center">
                    Escaneie o código QR no app do cliente.
                </p>
            </section>
        );
    };

    return (
        <section className="text-white text-shadow">
            {showTitle()}
            <main id="scanner" className="mb-5">
                <style jsx global>
                    {`
                        .qrPreviewVideo {
                            background: grey;
                            width: 100%;
                        }
                    `}
                </style>
            </main>
            <div style={{ margin: "50px 0 150px" }}>
                <CameraQrScannerGuide />
            </div>
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

/* ARCHIVE
setHistory((prev) => [...new Set([...prev, newScannedText])]);
*/
