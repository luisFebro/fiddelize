import React, { useState } from "react";
import ButtonFab from "../../../../../../components/buttons/material-ui/ButtonFab";
import ModalFullContent from "../../../../../../components/modals/ModalFullContent";
import { Load } from "../../../../../../components/code-splitting/LoadableComp";

const Async = Load({
    loader: () =>
        import(
            "./content/NpsContent" /* webpackChunkName: "nps-full-page-lazy" */
        ),
});

export default function NpsReportBtn({ mainData, disabled }) {
    const [fullOpen, setFullOpen] = useState(false);

    const AsyncNpsContent = <Async mainData={mainData} />;

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
                title="Relatório"
                onClick={handleFullOpen}
                backgroundColor={"var(--themeSDark--default)"}
                variant="extended"
                position="relative"
                disabled={disabled}
            />
            <ModalFullContent
                contentComp={AsyncNpsContent}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </section>
    );
}
