import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import getColor from "styles/txt";

const getStyles = (needDark) => ({
    rootProtectionMsg: {
        borderRadius: "30px",
        padding: "15px",
        border: needDark ? "1px solid #000" : "1px solid #fff",
    },
    miniLock: {
        fontSize: "20px",
    },
});

export default function ProtectionMsg({ backColor }) {
    const { needDark, txtColor } = getColor(backColor);

    const styles = getStyles(needDark);

    return (
        <section className="d-flex justify-content-center">
            <div style={styles.rootProtectionMsg}>
                <p
                    className={`font-weight-bold text-small text-center ${txtColor}`}
                >
                    <FontAwesomeIcon
                        className="mr-3"
                        icon="lock"
                        style={{
                            ...styles.miniLock,
                            color: needDark ? "var(--mainDark)" : "white",
                        }}
                    />
                    Nunca compartilhe sua senha.
                </p>
                <p className={`text-small text-center ${txtColor}`}>
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
