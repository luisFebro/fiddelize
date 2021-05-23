import { useState } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";
import { useBizData } from "init";
import CropFreeIcon from "@material-ui/icons/CropFree";

const AsyncQrCodeScanner = Load({
    loading: true,
    loader: () =>
        import(
            "./QrCodeScanner" /* webpackChunkName: "receipt-qr-code-page-lazy" */
        ),
});

export default function QrCodeScannerBtn() {
    const [fullOpen, setFullOpen] = useState(false);
    const { themeSColor, themePColor } = useBizData();

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    return (
        <section>
            <ButtonFab
                size="large"
                iconMu={<CropFreeIcon style={{ fontSize: 35 }} />}
                backgroundColor={`var(--themeSDark--${themeSColor})`}
                onClick={handleFullOpen}
                position="relative"
            />
            <ModalFullContent
                contentComp={<AsyncQrCodeScanner />}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
                needIndex={false}
                backgroundColor={`var(--themePDark--${themePColor})`}
            />
        </section>
    );
}
