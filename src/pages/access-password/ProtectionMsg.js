import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import selectTxtStyle from "../../utils/biz/selectTxtStyle";

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
    const needDark = selectTxtStyle(backColor, { needDarkBool: true });

    const styles = getStyles(needDark);

    return (
        <section className="d-flex justify-content-center">
            <div style={styles.rootProtectionMsg}>
                <p
                    className={`font-weight-bold text-small text-center ${selectTxtStyle(
                        backColor
                    )}`}
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
                <p
                    className={`text-small text-center ${selectTxtStyle(
                        backColor
                    )}`}
                >
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
