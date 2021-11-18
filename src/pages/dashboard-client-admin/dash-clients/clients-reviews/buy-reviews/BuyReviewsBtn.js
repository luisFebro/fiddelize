import { useState } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";

const Async = Load({
    loader: () =>
        import(
            "./content/BuyReviewsContent" /* webpackChunkName: "buy-reviews-full-page-lazy" */
        ),
});

export default function BuyReviewsBtn({ lastDateChecked, isBizAdmin }) {
    const [fullOpen, setFullOpen] = useState(false);

    const AsyncBuyReportContent = (
        <Async lastDateChecked={lastDateChecked} isBizAdmin={isBizAdmin} />
    );

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
                title={isBizAdmin ? "Ver Relatos" : "Ver Relatos de Compra"}
                onClick={handleFullOpen}
                backgroundColor="var(--themeSDark--default)"
                variant="extended"
                position="relative"
            />
            <ModalFullContent
                contentComp={AsyncBuyReportContent}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </section>
    );
}
