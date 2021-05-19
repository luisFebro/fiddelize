// reference https://github.com/jbialobr/JsQRScanner
import { useEffect, useState } from "react";
import useBackColor from "hooks/useBackColor";
import { useBizData } from "init";
import removeImgFormat from "utils/biz/removeImgFormat";
import showToast from "components/toasts";
import { prerenderAudio, playAudio } from "hooks/media/usePlayAudio";
import useQrScanner from "hooks/media/useQrScanner";

export default function QrScanner() {
    const [history, setHistory] = useState([]);
    const { themePColor, bizLogo } = useBizData();

    const timer = useUpdater();

    useBackColor(`var(--themePDark--${themePColor})`);
    useQrScanner();

    async function handleNewScannedTxt(newText) {
        await playAudio("audio_cli-staff_scanner-beep");
        await playAudio("audio_cli-staff_detected-receipt");
        showToast(`Comprovante Detectado: ${newText}`, {
            type: "success",
            dur: 10000,
        });
    }

    useEffect(() => {
        setScannerBeep();
    }, []);

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
                            width: 100%;
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
