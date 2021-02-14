import { useState } from "react";
import PropTypes from "prop-types";
import ButtonFab from "../../../../../../../components/buttons/material-ui/ButtonFab";
import ModalConfYesNo from "./ModalConfYesNo";
import { buttonFabType } from "../../../../../../../types";

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
        position,
        variant,
        iconFontAwesome,
        iconMarginLeft,
        shadowColor,
        top,
        left,
        backgroundColor,
        size,
        iconMu,
    } = button;

    const onOpen = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
        // setSelectedValue(value); using redux update instead
    };

    return (
        <div>
            <ButtonFab
                title={title}
                iconFontAwesome={iconFontAwesome}
                iconMu={iconMu}
                iconMarginLeft={iconMarginLeft}
                shadowColor={shadowColor}
                backgroundColor={backgroundColor}
                onClick={onOpen}
                position={position}
                variant={variant}
                size={size}
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
