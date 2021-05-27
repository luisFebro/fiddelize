import { useState } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";
import { useBizData } from "init";
import CropFreeIcon from "@material-ui/icons/CropFree";

const AsyncBenefitScanner = Load({
    loading: true,
    loader: () =>
        import(
            "./BenefitScanner" /* webpackChunkName: "qr-code-benefit-scanner-page-lazy" */
        ),
});

export default function BenefitScannerBtn() {
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
                contentComp={<AsyncBenefitScanner />}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
                needIndex={false}
                backgroundColor={`var(--themePDark--${themePColor})`}
            />
        </section>
    );
}
