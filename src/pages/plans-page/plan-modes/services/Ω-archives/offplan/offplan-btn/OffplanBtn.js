import { useState } from "react";
import ButtonFab from "../../../../../../../components/buttons/material-ui/ButtonFab";
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

export default function OffplanBtn({
    colorS = "white",
    right,
    bottom,
    modalData,
    from = "mobileApp", // removed discount scores from client hisotry
}) {
    const [fullOpen, setFullOpen] = useState(false);

    const AsyncOffplanContent = <Async modalData={modalData} />;

    const styles = getStyles();

    const disabledTeamFeature =
        modalData && modalData.title === "Connecta Membros";
    const handleFullOpen = () => {
        if (disabledTeamFeature) return;
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    return (
        <section>
            <ButtonFab
                size="medium"
                title={disabledTeamFeature ? "Em breve" : "Saiba mais"}
                onClick={handleFullOpen}
                backgroundColor={
                    disabledTeamFeature
                        ? "var(--themePLight)"
                        : "var(--themeSDark--default)"
                }
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
