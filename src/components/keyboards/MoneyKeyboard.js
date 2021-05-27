import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import usePlayAudio from "../../hooks/media/usePlayAudio";
import moneyMaskBr from "../../utils/validation/masks/moneyMaskBr";
import showToast from "../toasts";

MoneyKeyboard.propTypes = {
    setDisplay: PropTypes.func,
    display: PropTypes.string,
};

const isInvalidValue = (money) => {
    if (!money) return false;

    const lastChar = money[money.length - 1];

    if (lastChar === "." || lastChar === ",")
        return "Valor não pode terminar com vírgula ou ponto.";

    return false;
};

export default function MoneyKeyboard({
    keyboardType,
    setDisplay,
    display,
    handleReturn,
    handleConfirm,
    colorP,
}) {
    usePlayAudio("/sounds/confirmation-keypad.wav", ".keypadBeepConfirm");

    const getValue = (value) => {
        if (display.length >= 10) return setDisplay(display);

        const updatedValue = moneyMaskBr((display += value));
        setDisplay(updatedValue);
    };

    const eraseLastChar = () => {
        setDisplay((display) => display.slice(0, -1));
    };

    const playBeep = () => {
        const elem = document.querySelector("#keypadBeep");
        elem.play();
    };

    return (
        <section className="container-center">
            <section className="root animated fadeInUp">
                <section>
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
                            handleReturn();
                            playBeep();
                        }}
                        style={{ fontSize: "1.8em" }}
                        className="d-flex align-items-center justify-content-center return side-btn"
                    >
                        <FontAwesomeIcon
                            icon="reply"
                            style={{ fontSize: ".9em" }}
                            className="mr-2 icon-shadow"
                        />
                        <span style={{ fontSize: ".7em" }}>Voltar</span>
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
                        onClick={() => {
                            if (!display)
                                return showToast(
                                    "Insira o valor gasto pelo cliente em R$",
                                    { type: "error" }
                                );

                            const errorInvalidMsg = isInvalidValue(display);
                            if (errorInvalidMsg)
                                return showToast(errorInvalidMsg, {
                                    type: "error",
                                });

                            handleConfirm();
                        }}
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
                    <div className="empty" />
                </section>
                <audio id="keypadBeep" src="/sounds/tock.mp3" />
            </section>
            <style jsx global>
                {`
                    .root > section div {
                        background: linear-gradient(
                            to right,
                            #16222a,
                            ${colorP
                                ? `var(--themePLight--${colorP})`
                                : "#3a6073"}
                        );
                    }
                `}
            </style>
            <style jsx global>
                {`
                    .root {
                        bottom: 0;
                        position: fixed;
                        width: 100%;
                        max-width: 400px;
                    }

                    .root > section {
                        display: grid;
                        grid-template-columns: 1fr 1fr 1fr 40%;
                        grid-gap: 5px;
                        background-color: var(--mainDark);
                        padding: 10px;
                        font-size: 100%;
                    }

                    .root > section div {
                        color: white;
                        text-align: center;
                        text-shadow: 1px 1px 3px black;
                        padding: 10px 0;
                        font-weight: bolder;
                        font-size: 2em;
                        border-radius: 15px;
                    }

                    .root > section div:active {
                        background: white;
                    }

                    .root > section div:hover {
                        position: relative;
                        top: 1px;
                        left: 1px;
                        border-color: #e5e5e5;
                        cursor: pointer;
                    }

                    .root .side-btn {
                        font-size: 1.4em;
                    }

                    .root .erase-last {
                        background: #fbc531;
                    }

                    .root .return {
                        background: var(--lightBlue);
                    }

                    .root .confirm {
                        background: #4cd137;
                        grid-column: 4;
                        grid-row: 3 / span 2;
                    }
                `}
            </style>
        </section>
    );
}
