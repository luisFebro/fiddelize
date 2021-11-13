import { useState } from "react";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";
import usePro from "init/pro";
import FuncExpModal from "components/pro/func-exp-modal/FuncExpModal";

const AsyncNewScoreModal = Load({
    loading: true,
    loader: () =>
        import(
            "./content/FieldsHandler" /* webpackChunkName: "new-score-full-page-lazy" */
        ),
});

const muStyle = {
    transform: "scale(1.5)",
    color: "#fff",
    filter: "drop-shadow(.1px .1px .9px grey)",
};

const PlusIcon = <AddCircleOutlineIcon style={muStyle} />;

export default function AddTempPointsBtn({
    title = "MOEDAS",
    size = "large",
    backColor,
    sColor,
    needClick = true,
    clientScoreOnly, // for quick register
    clientName, // for quick register
    handleCustomerScore, // for quick register
    registerBtnTitle = "Adicionar Moedas",
}) {
    const [fullOpen, setFullOpen] = useState(false);
    const [expModal, setExpModal] = useState(false);

    const { isProExpBlock2 } = usePro();

    const handleFullOpen = () => {
        if (isProExpBlock2) return setExpModal(true);
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
                    iconToLeft
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
            {expModal && (
                <FuncExpModal expModal={expModal} setExpModal={setExpModal} />
            )}
        </section>
    );
}
