import React, { useState } from "react";
import ButtonFab from "../../../../../../components/buttons/material-ui/ButtonFab";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import ModalFullContent from "../../../../../../components/modals/ModalFullContent";
import { Load } from "../../../../../../components/code-splitting/LoadableComp";

const Async = Load({
    loader: () =>
        import(
            "./AsyncAddMembersContent" /* webpackChunkName: "add-members-full-page-lazy" */
        ),
});

const getStyles = (props) => ({
    muStyle: {
        transform: "scale(1.5)",
        color: "#fff",
        filter: "drop-shadow(.1px .1px .9px grey)",
    },
});

export default function AddMembersBtn({ btnTitle = "Adicionar", modalData }) {
    const [fullOpen, setFullOpen] = useState(false);

    const styles = getStyles();
    const PlusIcon = <AddCircleOutlineIcon style={styles.muStyle} />;

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    const AsyncAddCustomersContent = (
        <Async
            modalData={modalData}
            handleFullClose={handleFullClose}
            needRemoveCurrValue={btnTitle === "Alterar"}
        />
    );

    return (
        <section
            className={
                btnTitle !== "Adicionar"
                    ? "container-center"
                    : "container-center mt-2"
            }
        >
            <ButtonFab
                size="large"
                title={btnTitle}
                onClick={handleFullOpen}
                backgroundColor={"var(--themeSDark--default)"}
                variant="extended"
                position="relative"
                iconMu={PlusIcon}
            />
            <ModalFullContent
                contentComp={AsyncAddCustomersContent}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </section>
    );
}
