import { useState } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import ModalFullContent from "components/modals/ModalFullContent";
import ZoomOutMapIcon from "@material-ui/icons/ZoomOutMap";
import useData, { useBizData } from "init";
import QrCodeReceipt from "./QrCodeReceipt";
import showToast from "components/toasts";
// import { Load } from "../../../../components/code-splitting/LoadableComp";

// const Async = Load({
//     loader: () =>
//         import(
//             "./AsyncPayContent" /* webpackChunkName: "pay-full-page-lazy" */
//         ),
// });

export default function QrCodeReceiptBtn({
    type = "expand", //
    top,
    left,
}) {
    const [fullOpen, setFullOpen] = useState(false);
    const { gotOverflowedBenefits = false } = useData();
    const { themePColor, themeSColor } = useBizData();

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    return (
        <section>
            {type === "expand" && (
                <ButtonFab
                    size="small"
                    iconMu={<ZoomOutMapIcon />}
                    onClick={
                        gotOverflowedBenefits.targetPrize
                            ? () =>
                                  showToast(
                                      "É preciso mais um cartão de compra de qualquer valor para registrar e resgatar este benefício. Obrigada!",
                                      { dur: 20000 }
                                  )
                            : handleFullOpen
                    }
                    backgroundColor={`var(--themeSDark--${themeSColor})`}
                    top={-30}
                    left={-20}
                />
            )}
            {type === "receiptText" && (
                <ButtonFab
                    size="small"
                    title="abrir comprovante"
                    needTxtNoWrap
                    textTransform="lowercase"
                    onClick={handleFullOpen}
                    variant="extended"
                    backgroundColor={`var(--themeS--${themeSColor})`}
                    top={top || -70}
                    left={left || -70}
                />
            )}
            <ModalFullContent
                contentComp={<QrCodeReceipt />}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
                backgroundColor={`var(--themeBackground--${themePColor})`}
            />
        </section>
    );
}
