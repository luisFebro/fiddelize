import React, { useState } from "react";
import ButtonFab from "../../../../../../components/buttons/material-ui/ButtonFab";
import ModalFullContent from "../../../../../../components/modals/ModalFullContent";
import { Load } from "../../../../../../components/code-splitting/LoadableComp";

const Async = Load({
    loader: () =>
        import(
            "./content/XpGradeContent" /* webpackChunkName: "xp-grade-full-page-lazy" */
        ),
});

export default function XpGradeReportBtn({ disabled }) {
    const [fullOpen, setFullOpen] = useState(false);

    const AsyncXpGradeContent = <Async />;

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
                contentComp={AsyncXpGradeContent}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </section>
    );
}
