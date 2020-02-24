import React, { useState } from 'react';
import ButtonMulti from '../../buttons/material-ui/ButtonMulti';
import KeypadHandler from './KeypadHandler';
import PropTypes from 'prop-types';

KeypadButton.propTypes = {
    title: PropTypes.string.isRequired,
    titleIcon: PropTypes.string.isRequired,
    setSelectedValue: PropTypes.func.isRequired,
    keyboardType: PropTypes.string,
    confirmFunction: PropTypes.func,
}


export default function KeypadButton({
    title,
    titleIcon,
    keyboardType = "numeric",
    setSelectedValue,
    confirmFunction }) {
  const [open, setOpen] = useState(false);

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = (value, isCancel = false) => {
    setOpen(false);
    setSelectedValue(isCancel ? "0" : value);
  };

  const checkDataBeforeClose = value => {
    setSelectedValue(value);
    return true;
  }

  return (
    <div>
      <ButtonMulti
          onClick={onOpen}
          color="var(--mainWhite)"
          backgroundColor="var(--themeSDark)"
          backColorOnHover="var(--themeSDark)"
          iconFontAwesome="fas fa-keyboard"
          textTransform='uppercase'
      >
          Abrir Teclado
      </ButtonMulti>
      <KeypadHandler
            open={open}
            onClose={onClose}
            title={title}
            titleIcon={titleIcon}
            keyboardType={keyboardType}
            confirmFunction={confirmFunction}
            checkDataBeforeClose={checkDataBeforeClose}
      />
    </div>
  );
}

/*
USAGE EXEMPLE:
const [selectedValue, setSelectedValue] = useState("0");

return (
    <Fragment>
        <p className="text-normal">NEW VALUE: {selectedValue}</p>
        <KeypadButton
            title="Digite o Valor Gasto"
            titleIcon="far fa-money-bill-alt"
            keyboardType="numeric"
            setSelectedValue={setSelectedValue}
        />
    </Fragment>
);
 */