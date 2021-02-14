import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import usePlayAudio from "../../../hooks/media/usePlayAudio";
import animateCSS from "../../../utils/animateCSS";
import autoCpfMaskBr from "../../../utils/validation/masks/autoCpfMaskBr";

const isSmall = window.Helper.isSmallScreen();

Keyboard.propTypes = {
    keyboardType: PropTypes.oneOf(["numeric", "cpf"]).isRequired,
    setDisplay: PropTypes.func,
    display: PropTypes.string,
    handleClose: PropTypes.func,
    handleConfirm: PropTypes.func,
};

export default function Keyboard({
    keyboardType,
    setDisplay,
    display,
    handleClose,
    handleConfirm,
    colorP,
}) {
    const [reachedLimit, setReachedLimit] = useState(false);
    usePlayAudio("/sounds/confirmation-keypad.wav", ".keypadBeepConfirm");

    const refAnima = React.useRef(null);
    const getValue = (value) => {
        const handleCpf = () => {
            if (reachedLimit) return;

            if (display === "Digite 11 dígitos") {
                return setDisplay(value);
            }

            display += value;
            setDisplay(autoCpfMaskBr(display));

            if (display.length === 14) {
                refAnima &&
                    animateCSS(
                        refAnima.current,
                        "bounce",
                        "normal",
                        () => null
                    );
                setReachedLimit(true);
            }
        };

        if (keyboardType === "cpf") {
            handleCpf();
        }

        keyboardType === "numeric" &&
            (display.charAt(0) === "0"
                ? setDisplay(value)
                : setDisplay((display) => (display += value)));
    };

    const eraseLastChar = () => {
        display.length === 1
            ? setDisplay("0")
            : setDisplay((display) => display.slice(0, -1));
        if (reachedLimit) setReachedLimit(false);
    };

    const playBeep = () => {
        const elem = document.querySelector("#keypadBeep");
        elem.play();
    };

    return (
        <GridContainer
            myGradient={`linear-gradient(to right, #16222a, var(--themePLight--${colorP}))`}
        >
            <div
                onClick={() => {
                    getValue("1");
                    playBeep();
                }}
                className="item1"
            >
                1
            </div>
            <div
                onClick={() => {
                    getValue("2");
                    playBeep();
                }}
                className="item2"
            >
                2
            </div>
            <div
                onClick={() => {
                    getValue("3");
                    playBeep();
                }}
                className="item3"
            >
                3
            </div>
            <div
                onClick={() => {
                    eraseLastChar();
                    playBeep();
                }}
                style={{ fontSize: "1.8em" }}
                className="d-flex align-items-center flex-row justify-content-center erase-last side-btn"
            >
                <FontAwesomeIcon
                    icon="arrow-left"
                    style={{ fontSize: ".9em" }}
                    className="mr-2 icon-shadow"
                />
                <span style={{ fontSize: ".7em" }}>Corrigir</span>
            </div>
            <div
                onClick={() => {
                    getValue("4");
                    playBeep();
                }}
                className="item4"
            >
                4
            </div>
            <div
                onClick={() => {
                    getValue("5");
                    playBeep();
                }}
                className="item5"
            >
                5
            </div>
            <div
                onClick={() => {
                    getValue("6");
                    playBeep();
                }}
                className="item6"
            >
                6
            </div>
            <div
                onClick={() => {
                    handleClose();
                    playBeep();
                }}
                style={{ fontSize: "1.8em" }}
                className="d-flex align-items-center justify-content-center cancel side-btn"
            >
                <FontAwesomeIcon
                    icon="times"
                    style={{ fontSize: ".9em" }}
                    className="mr-2 icon-shadow"
                />
                <span style={{ fontSize: ".7em" }}>Cancelar</span>
            </div>
            <div
                onClick={() => {
                    getValue("7");
                    playBeep();
                }}
                className="item7"
            >
                7
            </div>
            <div
                onClick={() => {
                    getValue("8");
                    playBeep();
                }}
                className="item8"
            >
                8
            </div>
            <div
                onClick={() => {
                    getValue("9");
                    playBeep();
                }}
                className="item9"
            >
                9
            </div>
            <div
                onClick={handleConfirm}
                ref={refAnima}
                className="keypadBeepConfirm d-flex flex-column justify-content-center confirm side-btn"
            >
                <FontAwesomeIcon
                    icon="check"
                    style={{ fontSize: "1.9em" }}
                    className="icon-shadow d-flex align-self-center"
                />
                <span style={{ fontSize: ".9em" }}>Confirmar</span>
            </div>
            <div className="empty" />
            <div
                onClick={() => {
                    getValue("0");
                    playBeep();
                }}
                className="item0"
            >
                0
            </div>
            <div
                onClick={() => {
                    getValue(",");
                    playBeep();
                }}
                className="comma"
            >
                {keyboardType === "numeric" ? "," : ""}
            </div>
            <audio id="keypadBeep" src="/sounds/tock.mp3" />
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
    }

    & > div {
        background: ${({ myGradient }) =>
            myGradient || "linear-gradient(to right, #16222a, #3a6073)"};
        color: white;
        text-align: center;
        text-shadow: 1px 1px 3px black;
        padding: 10px 0;
        font-weight: bolder;
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
        background: #ea2027;
    }

    & .confirm {
        background: #4cd137;
        grid-column: 4;
        grid-row: 3 / span 2;
    }
`;
