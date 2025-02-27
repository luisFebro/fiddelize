import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import usePlayAudio from "../../hooks/media/usePlayAudio";

NumericKeyboard.propTypes = {
    setDisplay: PropTypes.func,
    display: PropTypes.string,
};

export default function NumericKeyboard({
    setDisplay,
    display,
    colorP = "purple",
    addCallback,
    eraseCallback,
}) {
    usePlayAudio("/sounds/confirmation-keypad.wav", ".keypadBeepConfirm");

    // const refAnima = React.useRef(null);
    const getValue = (value) => {
        if (display.length >= 6) return setDisplay(display);

        setDisplay((display += value));
        if (typeof addCallback === "function") {
            addCallback();
        }

        return null;
    };

    const eraseLastChar = () => {
        setDisplay((disp) => disp.slice(0, -1));
    };

    const playBeep = () => {
        const elem = document.querySelector("#keypadBeep");
        elem.play();
    };

    return (
        <section className="container-center">
            <section className="root animated fadeInUp delay-1s">
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
                            getValue("0");
                            playBeep();
                        }}
                        className="item0"
                    >
                        0
                    </div>
                    <div
                        onClick={() => {
                            eraseLastChar();
                            playBeep();

                            if (display.length <= 0) return setDisplay("");
                            if (typeof eraseCallback === "function") {
                                eraseCallback();
                            }
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
                        grid-template-columns: 1fr 1fr 1fr;
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

                    .root > section div:nth-child(11) {
                        grid-column: 2 / 4;
                    }
                `}
            </style>
        </section>
    );
}
