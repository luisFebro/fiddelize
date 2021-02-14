import { useState } from "react";
import PropTypes from "prop-types";
import { useStoreDispatch } from "easy-peasy";
import ButtonFab from "../../../../../../../components/buttons/material-ui/ButtonFab";
import { buttonFabType } from "../../../../../../../types";
import { setRun } from "../../../../../../../hooks/useRunComp";
import ModalTextField from "./ModalTextField";

ModalBtn.propTypes = {
    modalData: PropTypes.object.isRequired,
    button: PropTypes.shape(buttonFabType),
    setSelectedValue: PropTypes.func,
};

export default function ModalBtn({ modalData, button, setSelectedValue }) {
    const [open, setOpen] = useState(false);

    const dispatch = useStoreDispatch();

    const {
        title,
        iconFontAwesome,
        variant,
        top,
        left,
        backgroundColor,
        position,
        size,
        needCloseOtherModals,
    } = button;

    const onOpen = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
        // setSelectedValue(value); using redux update instead
    };

    const handleCloseModals = () => {
        needCloseOtherModals && setRun(dispatch, "closeModalFullContent");
    };

    return (
        <div>
            <ButtonFab
                title={title}
                iconFontAwesome={iconFontAwesome}
                variant={variant}
                top={top}
                left={left}
                backgroundColor={backgroundColor}
                onClick={onOpen}
                position={position}
                size={size}
            />
            <ModalTextField
                open={open}
                onClose={onClose}
                modalData={modalData}
                closeOtherModals={handleCloseModals}
            />
        </div>
    );
}
