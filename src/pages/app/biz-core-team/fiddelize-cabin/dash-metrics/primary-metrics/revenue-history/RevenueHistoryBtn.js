import { useState } from "react";
import ButtonFab from "../../../../../../../components/buttons/material-ui/ButtonFab";
import ModalFullContent from "../../../../../../../components/modals/ModalFullContent";
import { Load } from "../../../../../../../components/code-splitting/LoadableComp";

const Async = Load({
    loader: () =>
        import(
            "./RevenueHistoryContent" /* webpackChunkName: "revenue-history-full-page-lazy" */
        ),
});

export default function RevenueHistoryBtn() {
    const [fullOpen, setFullOpen] = useState(false);

    const AsyncRevenueHistoryContent = <Async />;

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
                title="Ver Histórico"
                onClick={handleFullOpen}
                backgroundColor="var(--themeSDark--default)"
                variant="extended"
                position="relative"
            />
            <ModalFullContent
                contentComp={AsyncRevenueHistoryContent}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </section>
    );
}
