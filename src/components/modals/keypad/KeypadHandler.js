import { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import PropTypes from "prop-types";
import Display from "./Display";
import IconAndTitle from "./IconAndTitle";
import Keyboard from "./Keyboard";
import showToast from "../../toasts";
import { useClientAdmin } from "../../../hooks/useRoleData";
import "./_KeypadHandler.scss";

NumericKeypad.propTypes = {
    title: PropTypes.string,
    titleIcon: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    keyboardType: PropTypes.oneOf(["numeric", "cpf"]),
    confirmFunction: PropTypes.func,
};

const defaultValue = {
    numeric: "0,0",
    cpf: "Digite 11 dígitos",
};
export default function NumericKeypad({
    title,
    titleIcon,
    keyboardType,
    onClose,
    open,
    confirmFunction,
    confirmPayload,
}) {
    const { selfThemePColor } = useClientAdmin();

    const [display, setDisplay] = useState(defaultValue[keyboardType]);

    const dispatch = useStoreDispatch();

    const handleClose = () => {
        setDisplay(defaultValue[keyboardType]);
        onClose();
    };

    const handleConfirm = () => {
        if (display === "Digite 11 dígitos")
            return showToast("Por favor, insira seu CPF para acesso", {
                type: "error",
            });
        if (confirmFunction(display, confirmPayload)) {
            onClose();
        }
    };

    return (
        <Dialog
            className="keypad-handler--root animated backInUp slower"
            maxWidth="md"
            disableBackdropClick
            onClose={handleClose}
            aria-labelledby="keypad"
            open={open}
        >
            <IconAndTitle
                title={title}
                titleIcon={titleIcon}
                colorP={selfThemePColor}
            />
            <Display
                display={display}
                keyboardType={keyboardType}
                colorP={selfThemePColor}
            />
            <Keyboard
                setDisplay={setDisplay}
                display={display}
                handleConfirm={handleConfirm}
                handleClose={handleClose}
                keyboardType={keyboardType}
                colorP={selfThemePColor}
            />
        </Dialog>
    );
}
