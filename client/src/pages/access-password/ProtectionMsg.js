import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const getStyles = () => ({
    rootProtectionMsg: {
        border: "1px solid #fff",
        borderRadius: "30px",
        padding: "15px",
    },
    miniLock: {
        fontSize: "20px",
        color: "white",
    },
});

export default function ProtectionMsg() {
    const styles = getStyles();

    return (
        <section className="d-flex justify-content-center">
            <div style={styles.rootProtectionMsg}>
                <p className="font-weight-bold text-small text-center text-white">
                    <FontAwesomeIcon
                        className="mr-3"
                        icon="lock"
                        style={styles.miniLock}
                    />
                    Nunca compartilhe sua senha.
                </p>
                <p className="text-small text-center text-white">
                    A Fiddelize não pedirá
                    <br />
                    sua senha por email ou
                    <br />
                    outros meios online.
                </p>
            </div>
        </section>
    );
}
