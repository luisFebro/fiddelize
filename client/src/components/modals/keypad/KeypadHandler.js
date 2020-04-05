import React, { useState } from 'react';
import Display from './Display';
import IconAndTitle from './IconAndTitle';
import Dialog from '@material-ui/core/Dialog';
import Keyboard from './Keyboard';
import PropTypes from 'prop-types';
import { useStoreDispatch } from 'easy-peasy';
import { showSnackbar } from '../../../redux/actions/snackbarActions';


NumericKeypad.propTypes = {
    title: PropTypes.string,
    titleIcon: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    keyboardType: PropTypes.oneOf(['numeric', 'cpf']),
    confirmFunction: PropTypes.func,
}

const defaultValue = {
    numeric: "0,0",
    cpf: "Digite 11 dígitos"
}
export default function NumericKeypad({
    title,
    titleIcon,
    keyboardType,
    onClose,
    open,
    confirmFunction,
}) {

    const [display, setDisplay] = useState(defaultValue[keyboardType]);

    const dispatch = useStoreDispatch();

    const handleClose = () => {
      setDisplay(defaultValue[keyboardType])
      onClose();
      // showSnackbar(dispatch, "A operação foi cancelada.", "warning", 5000);
    };

    const handleConfirm = () => {
      if(display === "Digite 11 dígitos") return showSnackbar(dispatch, "Por favor, insira seu CPF para acesso", 'error', 6000)
      if(confirmFunction(display)) {
          onClose();
      }

    };

    return (
        <Dialog
            className="animated zoomInDown slow"
            maxWidth={'md'}
            disableBackdropClick={true}
            onClose={handleClose}
            aria-labelledby="keypad"
            open={open}
        >
            <IconAndTitle
                title={title}
                titleIcon={titleIcon}
            />
            <Display
                display={display}
                keyboardType={keyboardType}
            />
            <Keyboard
                setDisplay={setDisplay}
                display={display}
                handleConfirm={handleConfirm}
                handleClose={handleClose}
                keyboardType={keyboardType}
            />
        </Dialog>
    );
}


