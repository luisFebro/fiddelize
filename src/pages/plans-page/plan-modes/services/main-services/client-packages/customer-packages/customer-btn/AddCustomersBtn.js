import { useState } from "react";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";

const Async = Load({
    loader: () =>
        import(
            "./AsyncAddCustomersContent" /* webpackChunkName: "add-customers-full-page-lazy" */
        ),
});

const getStyles = (props) => ({
    muStyle: {
        transform: "scale(1.5)",
        color: "#fff",
        filter: "drop-shadow(.1px .1px .9px grey)",
    },
});

export default function AddCustomersBtn({
    btnTitle = "Adicionar",
    modalData = {},
    linkTitle = "",
}) {
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
        <Async modalData={modalData} handleFullClose={handleFullClose} />
    );

    return (
        <section
            className={
                btnTitle !== "Adicionar"
                    ? "container-center"
                    : "container-center mt-2"
            }
        >
            {linkTitle ? (
                <a
                    className="text-link"
                    onClick={(e) => {
                        e.preventDefault();
                        handleFullOpen();
                    }}
                >
                    {linkTitle}
                </a>
            ) : (
                <ButtonFab
                    size="large"
                    title={btnTitle}
                    onClick={handleFullOpen}
                    backgroundColor="var(--themeSDark--default)"
                    variant="extended"
                    position="relative"
                    iconMu={PlusIcon}
                />
            )}
            <ModalFullContent
                contentComp={AsyncAddCustomersContent}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </section>
    );
}
