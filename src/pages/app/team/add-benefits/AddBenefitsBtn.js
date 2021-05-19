import { useState } from "react";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";
import { useBizData } from "init";

const AsyncBenefitsContent = Load({
    loading: true,
    loader: () =>
        import(
            "./content/BenefitsContent" /* webpackChunkName: "benefits-content-page-lazy" */
        ),
});

const muStyle = {
    transform: "scale(1.5)",
    color: "#fff",
    filter: "drop-shadow(.1px .1px .9px grey)",
};

const PlusIcon = <AddCircleOutlineIcon style={muStyle} />;

export default function AddBenefitsBtn() {
    const [fullOpen, setFullOpen] = useState(false);
    const { themeSColor } = useBizData();

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
                title="BENEFÍCIOS"
                iconToLeft
                backgroundColor={`var(--themeSDark--${themeSColor})`}
                onClick={handleFullOpen}
                iconMu={PlusIcon}
                position="relative"
                variant="extended"
            />
            <ModalFullContent
                contentComp={<AsyncBenefitsContent />}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
                needIndex={false}
                backgroundColor="var(--mainWhite)"
            />
        </section>
    );
}
