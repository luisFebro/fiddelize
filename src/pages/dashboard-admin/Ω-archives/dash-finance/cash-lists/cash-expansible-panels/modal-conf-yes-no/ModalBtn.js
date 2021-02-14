import { useState } from "react";
import PropTypes from "prop-types";
import ButtonFab from "../../../../../../components/buttons/material-ui/ButtonFab";
import ModalConfYesNo from "./ModalConfYesNo";
import { buttonFabType } from "../../../../../../types";

ModalBtn.propTypes = {
    modalData: PropTypes.object.isRequired,
    button: PropTypes.shape(buttonFabType),
    setSelectedValue: PropTypes.func,
};

export default function ModalBtn({
    modalData,
    button,
    setSelectedValue,
    setRun,
    run,
}) {
    const [open, setOpen] = useState(false);

    const {
        title,
        iconFontAwesome,
        iconMarginLeft,
        shadowColor,
        top,
        left,
        backgroundColor,
    } = button;

    const onOpen = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
        // setSelectedValue(value); using redux update instead
    };

    const styles = {
        fab: {
            transform: "translate(-50%, -50%)",
        },
    };

    return (
        <div>
            <ButtonFab
                title={title}
                iconFontAwesome={iconFontAwesome}
                iconMarginLeft={iconMarginLeft}
                shadowColor={shadowColor}
                top={top}
                left={left}
                style={styles.fab}
                backgroundColor={backgroundColor}
                onClick={onOpen}
            />
            <ModalConfYesNo
                open={open}
                onClose={onClose}
                modalData={modalData}
                setRun={setRun}
                run={run}
            />
        </div>
    );
}
