import React, { useState } from "react";
import ButtonFab from "../../../../../../../components/buttons/material-ui/ButtonFab";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import ModalFullContent from "../../../../../../../components/modals/ModalFullContent";
import { Load } from "../../../../../../../components/code-splitting/LoadableComp";

const Async = Load({
    loader: () =>
        import(
            "./AsyncOffplanContent" /* webpackChunkName: "offplan-services-full-page-lazy" */
        ),
});

const getStyles = (props) => ({
    muStyle: {
        transform: "scale(1.2)",
        filter: "drop-shadow(.5px .5px 1.5px black)",
        color: "#fff",
    },
});

export default function PurchaseHistoryBtn({
    colorS = "white",
    right,
    bottom,
    modalData,
    from = "mobileApp", // removed discount scores from client hisotry
}) {
    const [fullOpen, setFullOpen] = useState(false);

    const AsyncOffplanContent = <Async modalData={modalData} />;

    const styles = getStyles();

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    return (
        <section>
            <ButtonFab
                size="medium"
                title="Saiba mais"
                onClick={handleFullOpen}
                backgroundColor={"var(--themeSDark--default)"}
                variant="extended"
                position="relative"
            />
            <ModalFullContent
                contentComp={AsyncOffplanContent}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </section>
    );
}
