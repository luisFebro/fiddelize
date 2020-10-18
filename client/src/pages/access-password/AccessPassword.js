import React, { useState, Fragment } from "react";
import repeat from "../../utils/arrays/repeat";
import NumericKeyboard from "../../components/keyboards/NumericKeyboard";
import PasswordRecoverBtn from "./password-recover-modal/PasswordRecoverBtn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import isThisApp from "../../utils/window/isThisApp";
import { Link } from "react-router-dom";

const isApp = isThisApp();
const whichPath = isApp ? "/mobile-app" : "/";

const getStyles = () => ({
    passCircle: {
        width: "40px",
        height: "40px",
        background: "transparent",
        borderRadius: "50%",
        border: "solid var(--mainWhite) 4px",
        margin: "0 5px",
    },
    innerCircle: {
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        background: "#fff",
    },
    closeBtn: {
        position: "fixed",
        top: 15,
        right: 20,
        fontSize: "1.9em",
        color: "var(--mainWhite)",
        cursor: "pointer",
        zIndex: 1500,
    },
});

const PasswordBlockField = ({ ind }) => {
    const styles = getStyles();

    return (
        <div className="container-center" style={styles.passCircle}>
            <div
                className={`d-none pass-block-${++ind}`}
                style={styles.innerCircle}
            ></div>
        </div>
    );
};

export default function AccessPassword() {
    const [display, setDisplay] = useState("");

    const styles = getStyles();

    const showCloseBtn = () => (
        <Link className="no-text-decoration" to={whichPath}>
            <FontAwesomeIcon icon="times" style={styles.closeBtn} />
        </Link>
    );

    const showPasswordArea = () => (
        <Fragment>
            <p className="mt-5 text-subtitle text-white text-center">
                Digite sua senha:
            </p>
            <p className="text-subtitle text-white text-center">{display}</p>
            <section
                className="mt-4 container-center shake-it"
                style={{ marginBottom: 200 }}
            >
                {repeat(6).map((x, ind) => (
                    <PasswordBlockField key={ind} ind={ind} />
                ))}
            </section>
        </Fragment>
    );

    const showNextField = () => {
        let counter = display.length;
        const currTypingField = document.querySelector(
            `.pass-block-${++counter}`
        );
        if (currTypingField) currTypingField.classList.add("d-block");
    };

    const undoClick = () => {
        let counter = display.length;
        const currTypingField = document.querySelector(
            `.pass-block-${counter}`
        );
        if (currTypingField) currTypingField.classList.remove("d-block");
    };

    return (
        <section>
            {showCloseBtn()}
            {showPasswordArea()}
            <section style={{ marginBottom: 330 }}>
                <PasswordRecoverBtn />
            </section>
            <NumericKeyboard
                setDisplay={setDisplay}
                display={display}
                addCallback={showNextField}
                eraseCallback={undoClick}
            />
        </section>
    );
}
