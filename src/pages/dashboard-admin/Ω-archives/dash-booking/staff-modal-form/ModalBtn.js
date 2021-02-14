import { useState } from "react";
import PropTypes from "prop-types";
import ButtonFab from "../../../../components/buttons/material-ui/ButtonFab";
import ModalForm from "./ModalForm";
import { buttonFabType } from "../../../../types";

ModalBtn.propTypes = {
    modal: PropTypes.object.isRequired,
    button: PropTypes.shape(buttonFabType),
    setSelectedValue: PropTypes.func,
    setRun: PropTypes.func,
    run: PropTypes.bool,
};

export default function ModalBtn({
    modal,
    button,
    setSelectedValue,
    setRun,
    run,
}) {
    const [open, setOpen] = useState(false);

    const {
        left,
        top,
        fontSize,
        variant,
        title,
        iconMarginLeft,
        iconFontAwesome,
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
                left={left}
                top={top}
                fontSize={fontSize}
                title={title}
                variant={variant}
                iconMarginLeft={iconMarginLeft}
                iconFontAwesome={iconFontAwesome}
                backgroundColor={backgroundColor}
                onClick={onOpen}
            />
            <ModalForm
                open={open}
                onClose={onClose}
                modal={modal}
                setRun={setRun}
                run={run}
            />
        </div>
    );
}
