import { useState } from "react";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import ButtonFab from "../../../../../components/buttons/material-ui/ButtonFab";
import ModalFullContent from "../../../../../components/modals/ModalFullContent";
import { Load } from "../../../../../components/code-splitting/LoadableComp";

const Async = Load({
    loader: () =>
        import(
            "./AsyncAddSMSContent" /* webpackChunkName: "sms-credits-full-page-lazy" */
        ),
});

const getStyles = (props) => ({
    muStyle: {
        transform: "scale(1.5)",
        color: "#fff",
        filter: "drop-shadow(.1px .1px .9px grey)",
    },
});

export default function AddSMSBtn({
    btnTitle = "Adicionar",
    handleItem,
    smsOrder,
    classPosition = "mt-5 ml-3",
    modalData,
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

    const AsyncAddSMSContent = (
        <Async
            currValues={smsOrder}
            handleItem={handleItem}
            handleFullClose={handleFullClose}
            modalData={modalData}
        />
    );

    return (
        <section className={btnTitle !== "Adicionar" ? "" : classPosition}>
            <ButtonFab
                size="large"
                width="100%"
                title={btnTitle}
                onClick={handleFullOpen}
                backgroundColor="var(--themeSDark--default)"
                variant="extended"
                position="relative"
                iconMu={PlusIcon}
            />
            <ModalFullContent
                contentComp={AsyncAddSMSContent}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </section>
    );
}
