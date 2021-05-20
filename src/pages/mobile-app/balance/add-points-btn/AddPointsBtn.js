import { useState } from "react";
import { useBizData } from "init";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import getColor from "styles/txt";

const AsyncAddPoints = Load({
    loader: () =>
        import(
            "./AddPointsContent" /* webpackChunkName: "add-points-full-page-lazy" */
        ),
});

const muStyle = {
    transform: "scale(1.5)",
    color: "#fff",
    filter: "drop-shadow(.1px .1px .9px grey)",
};

const PlusIcon = <AddCircleOutlineIcon style={muStyle} />;

export default function AddPointsBtn() {
    const { themeBackColor } = useBizData();

    const [fullOpen, setFullOpen] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    return (
        <section>
            <ButtonFab
                title="Adicionar"
                position="relative"
                onClick={handleFullOpen}
                size="large"
                variant="extended"
                iconMu={PlusIcon}
                backgroundColor="var(--niceUiYellow)"
                iconToLeft
                needBtnShadow={false}
                shadowColor="#fff"
            />
            <ModalFullContent
                contentComp={<AsyncAddPoints closeModal={handleFullClose} />}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
                backgroundColor={`var(--themeBackground--${themeBackColor})`}
            />
        </section>
    );
}
