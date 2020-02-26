import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import cpfMaskBr from '../../../utils/validation/masks/cpfMaskBr';

const isSmall = window.Helper.isSmallScreen();

Keyboard.propTypes = {
    keyboardType: PropTypes.oneOf(['numeric', 'cpf']).isRequired,
    setDisplay: PropTypes.func,
    display: PropTypes.string,
    handleClose: PropTypes.func,
    handleConfirm: PropTypes.func,
}

export default function Keyboard({
    keyboardType,
    setDisplay,
    display,
    handleClose,
    handleConfirm,
}) {

    const getValue = value => {

        const handleCpf = () => {
            if(display === "Digite 11 dígitos") {
                return setDisplay(value);
            }

            if(display.includes(".") || display.length < 11 && display.length >= 1) {
                setDisplay(display += value)
            }

            if(display.length === 11) {
                const maskCpf = cpfMaskBr(display)
                setDisplay(maskCpf);
            }
        }

        if(keyboardType === 'cpf') {
            handleCpf();
        }

        keyboardType === 'numeric' && (
            display.charAt(0) === "0"
            ? setDisplay(value)
            : setDisplay(display += value)
        )
    }

    const eraseLastChar = () => {
        display.length === 1
        ? setDisplay("0")
        : setDisplay(display.slice(0, -1));
    }

    const playBeep = () => {
        const elem = document.querySelector("#keypadBeep");
        elem.play();
    }

    const playBeepConfirm = () => {
        const elem = document.querySelector("#keypadBeepConfirm");
        elem.play();
    }

    return (
        <GridContainer myGradient="linear-gradient(to right, #16222a, var(--themePLight))">
            <div onClick={() => {getValue("1"); playBeep()} } className="item1">1</div>
            <div onClick={() => {getValue("2"); playBeep()} } className="item2">2</div>
            <div onClick={() => {getValue("3"); playBeep()} } className="item3">3</div>
            <div
                onClick={() => {eraseLastChar(); playBeep()} }
                style={{fontSize: '1.8em'}}
                className="d-flex align-items-center  flex-row justify-content-center erase-last side-btn"
            >
                <i style={{fontSize: '.9em'}} className="mr-2 fas fa-arrow-left"></i>
                <span style={{fontSize: '.7em'}}>Corrigir</span>
            </div>
            <div onClick={() => {getValue("4"); playBeep()} } className="item4">4</div>
            <div onClick={() => {getValue("5"); playBeep()} } className="item5">5</div>
            <div onClick={() => {getValue("6"); playBeep()} } className="item6">6</div>
            <div
                onClick={() => {handleClose(); playBeep()} }
                style={{fontSize: '1.8em'}}
                className="d-flex align-items-center justify-content-center cancel side-btn"
            >
                <i style={{fontSize: '.9em'}} className="mr-2 fas fa-times"></i>
                <span style={{fontSize: '.7em'}}>Cancelar</span>
            </div>
            <div onClick={() => {getValue("7"); playBeep()}} className="item7">7</div>
            <div onClick={() => {getValue("8"); playBeep()}} className="item8">8</div>
            <div onClick={() => {getValue("9"); playBeep()}} className="item9">9</div>
            <div onClick={() => {handleConfirm(); playBeepConfirm()} } className="d-flex flex-column justify-content-center confirm side-btn">
                <i style={{fontSize: '1.9em'}} className="fas fa-check"></i>
               <span style={{fontSize: '.9em'}}>Confirmar</span>
            </div>
            <div className="empty"></div>
            <div onClick={() => {getValue("0"); playBeep()}} className="item0">0</div>
            <div
                onClick={() => {getValue(","); playBeep()}}
                className="comma"
            >
                {keyboardType === 'numeric' ? "," : ""}
            </div>
            <audio id="keypadBeep" src="https://archive.org/download/tock_20191221/Tock.mp3"></audio>
            <audio id="keypadBeepConfirm" src="https://ia601500.us.archive.org/29/items/confirmation-keypad-sound/confirmation-keypad-sound.wav"></audio>
        </GridContainer>
    );
}

const GridContainer = styled.div`
    & {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 40%;
        grid-gap: 5px;
        background-color: var(--mainDark);
        padding: 10px;
        font-size: 100%;
        font-family: var(--mainFont);
    }

    & > div {
        background: ${({ myGradient }) => myGradient || `linear-gradient(to right, #16222a, #3a6073)`};
        color: white;
        font-weight: bolder;
        text-align: center;
        text-shadow: 1px 1px 3px black;
        padding: 10px 0;
        font-size: 2em;
        border-radius: 15px;
    }

    & > div:active {
        background: white;
    }

    & > div:hover {
        position: relative;
        top: 1px;
        left: 1px;
        border-color: #e5e5e5;
        cursor: pointer;
    }

    .side-btn {
        font-size: 1.4em;
    }

    & .erase-last {
        background: #fbc531;
    }

    & .cancel {
        background: #EA2027;
    }

    & .confirm {
        background: #4cd137;
        grid-column: 4;
        grid-row: 3 / span 2;
    }
`;


