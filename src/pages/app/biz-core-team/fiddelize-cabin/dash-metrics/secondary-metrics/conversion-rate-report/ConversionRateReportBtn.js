import { useState } from "react";
import ButtonFab from "../../../../../../../components/buttons/material-ui/ButtonFab";
import ModalFullContent from "../../../../../../../components/modals/ModalFullContent";
import { Load } from "../../../../../../../components/code-splitting/LoadableComp";

const Async = Load({
    loader: () =>
        import(
            "./ConversionRateReportContent" /* webpackChunkName: "conversion-rate-full-page-lazy" */
        ),
});

export default function ConversionRateReportBtn({
    mainData,
    percFreeCustomers,
    percProCustomers,
    disabled,
}) {
    const [fullOpen, setFullOpen] = useState(false);

    const AsyncRevenueHistoryContent = (
        <Async
            mainData={mainData}
            percFreeCustomers={percFreeCustomers}
            percProCustomers={percProCustomers}
        />
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
                title="Relatório"
                onClick={handleFullOpen}
                backgroundColor="var(--themeSDark--default)"
                variant="extended"
                position="relative"
                disabled={disabled}
            />
            <ModalFullContent
                contentComp={AsyncRevenueHistoryContent}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </section>
    );
}
