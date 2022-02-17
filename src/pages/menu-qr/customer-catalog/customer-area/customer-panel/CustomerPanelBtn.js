import { useState } from "react";
import ModalFullContent from "components/modals/ModalFullContent";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import LoadableVisible from "components/code-splitting/LoadableComp";

const AsyncCustomerPanelContent = LoadableVisible({
    loading: true,
    loader: () =>
        import(
            "./CustomerPanelContent" /* webpackChunkName: "customer-panel-content-lazy" */
        ),
});

export default function CustomerPanelBtn({
    sColor = "default",
    backColor = "default",
}) {
    const [fullOpen, setFullOpen] = useState(false);

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
                title="painel cliente"
                fontSize={10}
                position="relative"
                onClick={handleFullOpen}
                backgroundColor={`var(--themeSDark--${sColor})`}
                variant="extended"
            />
            <ModalFullContent
                contentComp={<AsyncCustomerPanelContent />}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
                needIndex={12000}
                backgroundColor={`var(--themeBackground--${backColor})`}
            />
        </section>
    );
}
