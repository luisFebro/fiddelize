import { useState, Fragment } from "react";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";
import RadiusBtn from "components/buttons/RadiusBtn";

const AsyncExternalOrderData = Load({
    loader: () =>
        import(
            "./ExternalOrderData" /* webpackChunkName: "external-order-data-lazy" */
        ),
});

export default function ExternalOrderDataBtn({
    sColor = "default",
    dataOnline,
}) {
    const [fullOpen, setFullOpen] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    return (
        <Fragment>
            <RadiusBtn
                title="Ver Dados"
                backgroundColor={`var(--themeSDark--${sColor})`}
                onClick={handleFullOpen}
                position="absolute"
                top={-15}
                right={-60}
                size="extra-small"
            />
            <ModalFullContent
                contentComp={<AsyncExternalOrderData dataOnline={dataOnline} />}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </Fragment>
    );
}
