import React, { useState, Fragment } from 'react';
import ButtonMulti, { faStyle } from '../../buttons/material-ui/ButtonMulti';
import AsyncKeypadHandler from './AsyncKeypadHandler';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import usePlayAudio from '../../../hooks/media/usePlayAudio';
import useDelay from '../../../hooks/useDelay';

KeypadButton.propTypes = {
    title: PropTypes.string.isRequired,
    titleIcon: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    setSelectedValue: PropTypes.func.isRequired,
    keyboardType: PropTypes.string,
    confirmFunction: PropTypes.func,
}

export default function KeypadButton({
    title,
    titleIcon,
    keyboardType = "numeric",
    // setSelectedValue,
    confirmFunction,
    backgroundColor, }) {
  const [open, setOpen] = useState(false);

  usePlayAudio("/sounds/high-tech.mp3", "#keypadButtonAudio");
  const ready = useDelay(3000);

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <ButtonMulti
          id="keypadButtonAudio"
          onClick={onOpen}
          color="var(--mainWhite)"
          backgroundColor={backgroundColor || "var(--themeSDark)"}
          backColorOnHover={backgroundColor || "var(--themeSDark)"}
          iconFontAwesome={<FontAwesomeIcon icon="keyboard" style={faStyle} />}
          textTransform='uppercase'
      >
          Abrir Teclado
      </ButtonMulti>
      {ready && (
        <AsyncKeypadHandler
           open={open}
           onClose={onClose}
           title={title}
           titleIcon={titleIcon}
           keyboardType={keyboardType}
           confirmFunction={confirmFunction}
        />
      )}
    </Fragment>
  );
}

/* ARCHIVES
// const checkDataBeforeClose = value => {
//   // setSelectedValue(value);
//   return true;
// }
*/

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