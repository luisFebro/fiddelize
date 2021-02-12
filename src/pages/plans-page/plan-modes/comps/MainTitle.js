import React, { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import parse from "html-react-parser";

const isSmall = window.Helper.isSmallScreen();

const getStyles = () => ({
    crownIcon: {
        position: "absolute",
        top: -13,
        right: -19,
        transform: "rotate(40deg)",
        color: "#fff",
        fontSize: 30,
    },
    clipPathBack: {
        top: 0,
        position: "absolute",
        background: "var(--themeP)",
        clipPath: "circle(90.5% at 23% 0)",
        webPackClipPath: "circle(90.5% at 23% 0)",
        padding: "250px",
        width: "100%",
    },
});

const CircleBack = () => {
    const styles = getStyles();

    return <div style={styles.clipPathBack}></div>;
};

export { CircleBack };

export default function MainTitle({
    customPlanTitle = "Plano",
    plan = "Ouro",
    planMsg,
}) {
    const styles = getStyles();

    const subtitle = parse(planMsg);
    return (
        <Fragment>
            <p
                style={{ marginTop: 70, lineHeight: isSmall ? "45px" : "65px" }}
                className="mb-4 text-center text-white text-hero"
            >
                <span
                    className="position-relative text-em-0-5"
                    style={{ left: -25 }}
                >
                    {customPlanTitle}
                </span>
                <br />
                <span className="d-inline-block position-relative">
                    {plan}{" "}
                    <FontAwesomeIcon icon="crown" style={styles.crownIcon} />
                </span>
            </p>
            <p className="position-relative mx-3 text-white text-normal">
                {subtitle}
            </p>
        </Fragment>
    );
}
