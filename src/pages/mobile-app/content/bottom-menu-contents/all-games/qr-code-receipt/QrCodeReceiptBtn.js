import { useState } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import ModalFullContent from "components/modals/ModalFullContent";
import ZoomOutMapIcon from "@material-ui/icons/ZoomOutMap";
import { useBizData } from "init";
import QrCodeReceipt from "./QrCodeReceipt";
// import { Load } from "../../../../components/code-splitting/LoadableComp";

// const Async = Load({
//     loader: () =>
//         import(
//             "./AsyncPayContent" /* webpackChunkName: "pay-full-page-lazy" */
//         ),
// });

export default function QrCodeReceiptBtn() {
    const [fullOpen, setFullOpen] = useState(false);
    const { themePColor, themeSColor } = useBizData();

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    return (
        <section>
            <ButtonFab
                size="small"
                iconMu={<ZoomOutMapIcon />}
                onClick={handleFullOpen}
                backgroundColor={`var(--themeSDark--${themeSColor})`}
                top={-30}
                left={-20}
            />
            <ModalFullContent
                contentComp={<QrCodeReceipt />}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
                backgroundColor={`var(--themeBackground--${themePColor})`}
            />
        </section>
    );
}
