import { useState } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";
import { useBizData } from "init";
import Icon from "styles/Icon";

const AsyncPointsScanner = Load({
    loading: true,
    loader: () =>
        import(
            "./PointsScanner" /* webpackChunkName: "qr-code-points-scanner-page-lazy" */
        ),
});

export default function PointsScannerBtn(props) {
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
                iconMu={<Icon type="qrCodeScanner" />}
                backgroundColor={`var(--themeSDark--${themeSColor})`}
                onClick={handleFullOpen}
                position="relative"
                title="escanear"
                variant="extended"
                needBtnShadow
                shadowColor="grey"
            />
            <ModalFullContent
                contentComp={
                    <AsyncPointsScanner
                        closeModal={handleFullClose}
                        {...props}
                    />
                }
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
                needIndex={false}
                backgroundColor={`var(--themePDark--${themePColor})`}
            />
        </section>
    );
}
