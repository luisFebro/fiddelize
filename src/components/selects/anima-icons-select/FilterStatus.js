import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useDelay from "../../../hooks/useDelay";

const getStyles = () => ({
    checkIcon: {
        fontSize: "15px",
        marginLeft: "10px",
        color: "var(--themeP)",
    },
});

export default function FilterStatus({ isReversed, loading, gotData = true }) {
    const [status, setStatus] = useState("Iniciando...");

    const readyStart = useDelay(6000);
    const styles = getStyles();

    useEffect(() => {
        const handleStatus = () => {
            if (loading) {
                return isReversed ? "invertendo ordem..." : "organizando...";
            } else {
                return "Organizado!";
            }
        };

        const thisTitle = readyStart ? handleStatus() : "Iniciando...";
        setStatus(thisTitle);
        setTimeout(() => {
            setStatus("Organizado!");
        }, 4000);
    }, [readyStart, loading, isReversed]);

    const needCheckIcon = status === "Organizado!";
    return (
        gotData && (
            <p className="mt-1 text-purple text-small font-weight-bold">
                <span className="text-em-1-1">STATUS: </span>
                {status}
                {needCheckIcon && (
                    <FontAwesomeIcon
                        className="animated rubberBand repeat-1"
                        icon="check-circle"
                        style={styles.checkIcon}
                    />
                )}
            </p>
        )
    );
}
