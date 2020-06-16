import React, { useState, Fragment, useEffect } from 'react';
import ButtonMulti, { faStyle } from '../../buttons/material-ui/ButtonMulti';
import KeypadHandler from './KeypadHandler';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

KeypadButton.propTypes = {
    title: PropTypes.string.isRequired,
    titleIcon: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    setSelectedValue: PropTypes.func.isRequired,
    keyboardType: PropTypes.string,
    confirmFunction: PropTypes.func,
}

 const preloadedAudio = () => {
    var audio = new Audio();
    audio.preload = "auto";
    audio.currentTime = 0;
    audio.src = "/sounds/high-tech.mp3";
    return audio;
}

export default function KeypadButton({
    title,
    titleIcon,
    keyboardType = "numeric",
    // setSelectedValue,
    confirmFunction,
    backgroundColor, }) {
  const [open, setOpen] = useState(false);

  // const [audio, setAudio] = useState(null);
  // console.log("audio", audio);
    // Create a Custom hook for this...
    // This is useful especially for longer medias.
  useEffect(() => {
        const audio = new Audio();
        const toneBtn = document.querySelector("#toneBtn");
        toneBtn.addEventListener("click", () => audio.play());

        fetch("/sounds/high-tech.mp3")
        .then(response => response.blob())
        .then(blob => convertBlobToData(blob, audio))
        .catch(err => console.log(err))

        const convertBlobToData = (blob, elem) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function() {
                const str64Data = reader.result;
                audio.src = str64Data;
            }
        }
  }, [])

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <ButtonMulti
          id="toneBtn"
          onClick={onOpen}
          color="var(--mainWhite)"
          backgroundColor={backgroundColor || "var(--themeSDark)"}
          backColorOnHover={backgroundColor || "var(--themeSDark)"}
          iconFontAwesome={<FontAwesomeIcon icon="keyboard" style={faStyle} />}
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
      />
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