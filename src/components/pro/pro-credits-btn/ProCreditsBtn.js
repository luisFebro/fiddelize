import { useState } from "react";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import ModalFullContent from "../../modals/ModalFullContent";
import ButtonFab from "../../buttons/material-ui/ButtonFab";
import pickPackageService from "./pickPackageService";

const addIconStyle = {
    transform: "scale(1.5)",
    color: "#fff",
    filter: "drop-shadow(.1px .1px .9px grey)",
};

export default function ProCreditsBtn({
    service = "Novvos Clientes",
    modalData,
}) {
    const [fullOpen, setFullOpen] = useState(false);

    const AddCircleIcon = <AddCircleOutlineIcon style={addIconStyle} />;

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    const handlePickedComp = () => {
        const PickedComp = pickPackageService({ service, data: modalData });
        return <PickedComp />;
    };

    const PickedComponent = handlePickedComp();

    return (
        <section>
            <ButtonFab
                position="relative"
                onClick={handleFullOpen}
                iconMu={AddCircleIcon}
                size="medium"
                color="white"
                backgroundColor="var(--themeSDark--default)"
            />
            <ModalFullContent
                contentComp={PickedComponent}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </section>
    );
}
