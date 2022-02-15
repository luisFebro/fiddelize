import { useState } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";

const Async = Load({
    loader: () =>
        import(
            "./AsyncPayContent" /* webpackChunkName: "pay-full-page-lazy" */
        ),
});

const getStyles = (props) => ({
    muStyle: {
        transform: "scale(1.2)",
        filter: "drop-shadow(.5px .5px 1.5px black)",
        color: "#fff",
    },
});

export default function PayBtn({
    colorS = "white",
    right,
    bottom,
    modalData,
    callback,
    from = "mobileApp", // removed discount scores from client hisotry
}) {
    const [fullOpen, setFullOpen] = useState(false);

    const AsyncPayContent = <Async modalData={modalData} />;

    const styles = getStyles();

    const handleFullOpen = () => {
        setFullOpen(true);
        callback();
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    return (
        <section>
            <ButtonFab
                size="large"
                title="VAMOS LÁ!"
                position="relative"
                onClick={handleFullOpen}
                backgroundColor="var(--themeSDark)"
                variant="extended"
            />
            <ModalFullContent
                contentComp={AsyncPayContent}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </section>
    );
}
