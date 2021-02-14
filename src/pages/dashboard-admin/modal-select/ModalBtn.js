import { useState } from "react";
import PropTypes from "prop-types";
import ButtonFab from "../../../components/buttons/material-ui/ButtonFab";
import ModalSelect_userFunction from "./ModalSelect_userFunction";
import { buttonFabType } from "../../../types";

ModalBtn.propTypes = {
    modal: PropTypes.object.isRequired,
    button: PropTypes.shape(buttonFabType),
};

export default function ModalBtn({ modal, button }) {
    const [open, setOpen] = useState(false);

    const {
        title,
        iconFontAwesome,
        variant,
        top,
        left,
        style,
        iconMarginLeft,
        backgroundColor,
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
                variant={variant}
                top={top}
                left={left}
                iconMarginLeft={iconMarginLeft}
                backgroundColor={backgroundColor}
                onClick={onOpen}
            />
            <ModalSelect_userFunction
                open={open}
                onClose={onClose}
                modal={modal}
            />
        </div>
    );
}
