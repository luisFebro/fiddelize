import React, { useState, useEffect, Fragment } from "react";
import repeat from "../../utils/arrays/repeat";
import NumericKeyboard from "../../components/keyboards/NumericKeyboard";
import PasswordRecoverBtn from "./password-recover-modal/PasswordRecoverBtn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import isThisApp from "../../utils/window/isThisApp";
import { Link } from "react-router-dom";
import Lock from "./interative-lock/Lock";
import { useClientAdmin } from "../../hooks/useRoleData";
import useBackColor from "../../hooks/useBackColor";
import useScrollUp from "../../hooks/scroll/useScrollUp";
import ProtectionMsg from "./ProtectionMsg";
import useAPI, { checkPassword, getUniqueId } from "../../hooks/api/useAPI";
import useGetVar from "../../hooks/storage/useVar";
import { showSnackbar } from "../../redux/actions/snackbarActions";
import { useStoreDispatch } from "easy-peasy";
import getAPI, {
    getDecryptedToken,
    getToken,
} from "../../utils/promises/getAPI";
import { getVar, setVar, store } from "../../hooks/storage/useVar";
import authenticate from "../../components/auth/helpers/authenticate";

const isApp = isThisApp();
const whichPath = isApp ? "/mobile-app" : "/";
const isSmall = window.Helper.isSmallScreen();

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

export default function AccessPassword({ history }) {
    const [display, setDisplay] = useState("");
    const [uniqueIdTrigger, setUniqueIdTrigger] = useState(false);
    const { selfThemeBackColor: backColor } = useClientAdmin();

    const dispatch = useStoreDispatch();

    const { data: userId } = useGetVar("userId", store.user);

    useEffect(() => {
        if (userId) {
            async function runToken() {
                const body = { _id: userId };
                const { data: encryptedToken } = await getAPI({
                    method: "post",
                    url: getToken(),
                    body,
                });
                setVar({ token: encryptedToken }, store.user);
            }
            runToken();
        }
    }, [userId]);

    const body = {
        userId,
        pswd: display,
    };
    const { pswd } = body;

    const completedFill = display && display.length === 6;

    const trigger = uniqueIdTrigger || (userId && pswd && completedFill);
    const { data: passOk, loading, error } = useAPI({
        method: "post",
        url: checkPassword(),
        body,
        trigger,
        loadingStart: false,
    });

    useEffect(() => {
        const success = passOk === true;
        if (completedFill && success) {
            async function runSuccess() {
                const token = await getVar("token", store.user);

                const body = { token };
                const { data: newToken } = await getAPI({
                    method: "post",
                    url: getDecryptedToken(),
                    body,
                });

                // wait for the lock animation to end...
                setTimeout(() => {
                    authenticate(newToken, { dispatch, history });
                }, 1000);
            }

            runSuccess();
        }

        if (completedFill && !success) {
            const uniqueId = getUniqueId();
            setUniqueIdTrigger(uniqueId);
        }
    }, [completedFill, passOk]);

    useEffect(() => {
        const wrongPassMsgCond = !loading && passOk === false;
        if (wrongPassMsgCond) {
            showSnackbar(dispatch, "Senha de acesso inválida.", "error", 2000);
            setDisplay("");
        }
    }, [passOk, loading]);

    useEffect(() => {
        if (error) {
            showSnackbar(
                dispatch,
                "Ocorreu um erro. Verifique sua conexão.",
                "error",
                4000
            );
            setDisplay("");
        }
    }, [error]);

    useBackColor(`var(--themeBackground--${backColor})`);
    useScrollUp();

    const styles = getStyles();

    const showInterativeLock = () => (
        <Lock
            backColor={`var(--themeBackground--${backColor})`}
            needUnlock={passOk}
            isLockLoading={completedFill && loading}
        />
    );

    const showCloseBtn = () => (
        <Link className="no-text-decoration" to={whichPath}>
            <FontAwesomeIcon icon="times" style={styles.closeBtn} />
        </Link>
    );

    const NUM_PASS_FIELD = 6;
    const showPasswordArea = () => (
        <Fragment>
            {!passOk && (
                <p
                    className={`${
                        isSmall ? "text-subtitle" : "text-normal m-0"
                    }  text-white text-center`}
                >
                    Digite sua senha:
                </p>
            )}
            {loading && trigger ? (
                <p className="text-subtitle text-white text-center">
                    Analizando...
                </p>
            ) : (
                <Fragment>
                    {passOk ? (
                        <p
                            className="mt-3 text-subtitle font-weight-bold text-white text-center"
                            style={{ marginBottom: 100 }}
                        >
                            Certo!{" "}
                            <FontAwesomeIcon
                                icon="check-circle"
                                style={{
                                    fontSize: 25,
                                    color: "var(--mainWhite)",
                                }}
                                className="ml-2 animated rubberBand delay-1s"
                            />
                        </p>
                    ) : (
                        <section
                            className="mt-1 container-center shake-it"
                            style={{ marginBottom: 100 }}
                        >
                            {repeat(NUM_PASS_FIELD).map((x, ind) => (
                                <PasswordBlockField key={ind} ind={ind} />
                            ))}
                        </section>
                    )}
                </Fragment>
            )}
        </Fragment>
    );

    const showNextField = () => {
        let counter = display.length;
        const currTypingField = document.querySelector(
            `.pass-block-${++counter}`
        );
        if (currTypingField) currTypingField.classList.toggle("d-block");
    };

    const undoClick = () => {
        let counter = display.length;
        const currTypingField = document.querySelector(
            `.pass-block-${counter}`
        );
        if (currTypingField) currTypingField.classList.toggle("d-block");
    };

    return (
        <section>
            {showInterativeLock()}
            {showCloseBtn()}
            {showPasswordArea()}
            <section className="mt-5 mb-2">
                <ProtectionMsg />
            </section>
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
