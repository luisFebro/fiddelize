import React, { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonFab from "../../components/buttons/material-ui/ButtonFab";

const getStyles = () => ({
    crownIcon: {
        top: "-18px",
        right: "-18px",
        transform: "rotate(40deg)",
        color: "#fff",
        fontSize: "35px",
    },
});

function GoldBtn({ setCurrPlan }) {
    const styles = getStyles();

    return (
        <Fragment>
            <FontAwesomeIcon
                icon="crown"
                className="position-absolute"
                style={{ ...styles.crownIcon, color: "var(--mainYellow)" }}
            />
            <ButtonFab
                position="relative"
                title="Ouro"
                variant="extended"
                size="large"
                backgroundColor="var(--niceUiYellow)"
                onClick={() => setCurrPlan("gold")}
            />
        </Fragment>
    );
}

function SilverBtn({ setCurrPlan }) {
    const styles = getStyles();

    return (
        <Fragment>
            <FontAwesomeIcon
                icon="crown"
                className="position-absolute"
                style={styles.crownIcon}
            />
            <ButtonFab
                position="relative"
                title="Prata"
                variant="extended"
                size="large"
                backgroundColor="rgb(194 191 191)"
                onClick={() => setCurrPlan("silver")}
            />
        </Fragment>
    );
}

function BronzeBtn({ setCurrPlan }) {
    const styles = getStyles();

    return (
        <Fragment>
            <FontAwesomeIcon
                icon="crown"
                className="position-absolute"
                style={{ ...styles.crownIcon, color: "#a17f73" }}
            />
            <ButtonFab
                position="relative"
                title="Bronze"
                variant="extended"
                size="large"
                backgroundColor="#a17f73"
                onClick={() => setCurrPlan("bronze")}
            />
        </Fragment>
    );
}

export { GoldBtn, SilverBtn, BronzeBtn };
