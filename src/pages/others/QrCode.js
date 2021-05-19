// qr - quick response code - QR stands for "Quick Response." While they may look simple, QR codes are capable of storing lots of data. But no matter how much they contain, when scanned, the QR code should allow the user to access information instantly – hence why it's called a Quick Response code.
import { useEffect, useState } from "react";
import removeImgFormat from "utils/biz/removeImgFormat";
import useQrScanner from "hooks/media/useQrScanner";
import showToast from "components/toasts";
import { prerenderAudio, playAudio } from "hooks/media/usePlayAudio";
import copyText from "utils/document/copyText";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import scrollIntoView from "utils/document/scrollIntoView";

export default function QrCode() {
    const [newQr, setNewQr] = useState("");
    const [history, setHistory] = useState([]);

    useQrScanner();
    const timer = useUpdater();

    useEffect(() => {
        setScannerBeep();
    }, []);

    useEffect(() => {
        const newScannedText = window.scannedText;
        const alreadyScanned = history.includes(newScannedText);
        if (!newScannedText || alreadyScanned) return null;

        setHistory((prev) => [...new Set([...prev, newScannedText])]);

        return handleNewScannedTxt(newScannedText, setNewQr);
        // eslint-disable-next-line
    }, [timer]);

    const showTitle = () => {
        const { newImg, width, height } = removeImgFormat(null);
        return (
            <section className="container-center-col mt-5">
                <img src={newImg} width={width} height={height} alt="logo" />
                <h1 className="mt-5 text-subtitle font-weight-bold text-center">
                    Escaneador QR
                </h1>
                <p className="mb-5 text-normal text-center">
                    Escaneie qualquer código QR
                    <br />
                    (quick response code)
                </p>
            </section>
        );
    };

    const showCopyButton = () => {
        const handleCopy = () => {
            copyText(newQr, { msg: "Código QR copiado!" });
        };

        return (
            <div className="container-center">
                <ButtonFab
                    title="copiar"
                    position="relative"
                    onClick={handleCopy}
                    size="small"
                    backgroundColor="var(--themeSDark)"
                    variant="extended"
                />
            </div>
        );
    };

    const showQrArea = () => (
        <section className="new-qr--root animated fadeInUp delay-4s">
            <h2 className="text-subtitle text-center">Resultado:</h2>
            <p className="mx-3 position-relative new-qr text-normal text-break p-3 font-weight-bold">
                {newQr}
            </p>
            {showCopyButton()}
            <style jsx>
                {`
                    .new-qr--root {
                        margin-top: 150px;
                    }

                    .new-qr {
                        background: var(--mainWhite);
                        color: var(--mainPurple);
                        text-shadow: none;
                        border-radius: 25px;
                    }
                `}
            </style>
        </section>
    );

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
            {newQr && showQrArea()}
            <div id="qrCodeArea" />
            <div style={{ marginBottom: "100px" }} />
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
async function handleNewScannedTxt(newText, setNewQr) {
    await playAudio("audio_cli-staff_scanner-beep");
    await playAudio("audio_detected-qr-copy");
    scrollIntoView("#qrCodeArea", { duration: 5000 });
    setNewQr(newText);
}

async function setScannerBeep() {
    await Promise.all([
        prerenderAudio(
            "/sounds/tts/scanner-beep/beep.mp3",
            "audio_scanner-beep"
        ),
        prerenderAudio(
            "/sounds/tts/scanner-beep/qr-detect-copy-now.mp3",
            "audio_detected-qr-copy"
        ),
    ]);
}
// END HELPERS
