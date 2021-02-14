import { useState } from "react";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import ButtonFab from "../../../../components/buttons/material-ui/ButtonFab";
import ModalFullContent from "../../../../components/modals/ModalFullContent";
import { Load } from "../../../../components/code-splitting/LoadableComp";

const AsyncNewScoreModal = Load({
    loading: true,
    loader: () =>
        import(
            "./new-score-modal/AsyncNewScoreModal" /* webpackChunkName: "new-score-full-page-lazy" */
        ),
});

const muStyle = {
    transform: "scale(1.5)",
    color: "#fff",
    filter: "drop-shadow(.1px .1px .9px grey)",
};

const PlusIcon = <AddCircleOutlineIcon style={muStyle} />;

export default function AddNewScoreBtn({
    title = "PONTOS",
    size = "large",
    backColor,
    sColor,
    needClick = true,
    clientScoreOnly, // for quick register
    clientName, // for quick register
    handleCustomerScore, // for quick register
    registerBtnTitle = "Adicionar Pontos",
}) {
    const [fullOpen, setFullOpen] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    const AsyncComp = (
        <AsyncNewScoreModal
            closeModal={handleFullClose}
            clientScoreOnly={clientScoreOnly}
            clientName={clientName}
            handleCustomerScore={handleCustomerScore}
        />
    );

    return (
        <section>
            {clientScoreOnly ? (
                <ButtonFab
                    title={registerBtnTitle}
                    backgroundColor={`var(--themeSDark--${sColor})`}
                    onClick={handleFullOpen}
                    position="relative"
                    variant="extended"
                    size="large"
                />
            ) : (
                <ButtonFab
                    size={size}
                    title={title}
                    backgroundColor={`var(--themeSDark--${sColor})`}
                    onClick={needClick ? handleFullOpen : null}
                    iconMu={PlusIcon}
                    position="relative"
                    variant="extended"
                />
            )}
            <ModalFullContent
                contentComp={AsyncComp}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
                needIndex={false}
                backgroundColor={`var(--themeBackground--${backColor})`}
            />
        </section>
    );
}
