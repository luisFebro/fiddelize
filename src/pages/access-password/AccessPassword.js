import React, { useState, useEffect, Fragment } from "react";
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
import useData from "../../hooks/useData";
import { showSnackbar } from "../../redux/actions/snackbarActions";
import { useStoreDispatch } from "easy-peasy";
import getAPI, {
    checkPassword,
    getDecryptedToken,
    getToken,
} from "../../utils/promises/getAPI";
import { getVar, setVar, store } from "../../hooks/storage/useVar";
import authenticate from "../../components/auth/helpers/authenticate";
import selectTxtStyle from "../../utils/biz/selectTxtStyle";
import PasswordCircleFields from "../../components/fields/PasswordCircleFields";
import { Load } from "../../components/code-splitting/LoadableComp";

export const AsyncBlocked = Load({
    loader: () =>
        import("./AsyncBlocked" /* webpackChunkName: "block-comp-lazy" */),
});

const isApp = isThisApp();
const whichPath = isApp ? "/mobile-app" : "/";
const isSmall = window.Helper.isSmallScreen();

const getStyles = () => ({
    closeBtn: {
        position: "fixed",
        top: 15,
        right: 20,
        fontSize: "1.9em",
        cursor: "pointer",
        zIndex: 1500,
    },
});

export default function AccessPassword({ history, isBizTeam = false }) {
    const [display, setDisplay] = useState("");
    const [data, setData] = useState({
        isBlocked: false,
        lockMin: 0,
        passOk: false,
        loading: false,
    });
    const { isBlocked, lockMin, passOk, loading } = data;

    const role = isBizTeam ? "nucleo-equipe" : "cliente-admin";

    const {
        selfThemeBackColor: backColor,
        selfThemePColor: colorP,
    } = useClientAdmin();

    const styles = getStyles();
    const dispatch = useStoreDispatch();

    const needDark = selectTxtStyle(backColor, { needDarkBool: true });
    useBackColor(
        `var(--themeBackground--${isBizTeam ? "default" : backColor})`
    );
    useScrollUp();

    const [userId] = useData(["userId"], { dots: false });

    useEffect(() => {
        if (userId) {
            async function checkIfLocked() {
                return await getAPI({
                    method: "post",
                    url: checkPassword(),
                    body: {
                        userId,
                        checkIfLocked: true,
                        role,
                    },
                });
            }
            async function runToken() {
                const body = { _id: userId, role };
                const { data: encryptedToken } = await getAPI({
                    method: "post",
                    url: getToken(),
                    body,
                });
                setVar({ token: encryptedToken }, store.user);
            }
            Promise.all([checkIfLocked(), runToken()]).then((res) => {
                const [lockedRes] = res;
                if (lockedRes) {
                    const { blocked, lockMin } = lockedRes.data;
                    if (blocked) {
                        setData((prev) => ({
                            ...prev,
                            isBlocked: true,
                            lockMin,
                        }));
                    }
                }
            });
        }
    }, [userId]);

    // PASS FIELD'S HANDLERS
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
    // END PASS FIELD'S HANDLERS

    const runCheckPassword = async () => {
        const body = {
            userId,
            pswd: display,
            role,
        };

        setData((prev) => ({ ...prev, loading: true }));
        const data = await getAPI({
            method: "post",
            url: checkPassword(),
            body,
        }).catch((error) => {
            const wrongPassMsgCond = error === false;
            if (wrongPassMsgCond) {
                showSnackbar(
                    dispatch,
                    "Senha de acesso inválida.",
                    "error",
                    2000
                );
                setData((prev) => ({ ...prev, loading: false }));
                setDisplay("");
                return;
            }

            const isThisBlocked = error && error.blocked;

            if (isThisBlocked) {
                setData((prev) => ({
                    ...prev,
                    isBlocked: true,
                    lockMin: error.minutes,
                    loading: false,
                }));
            } else {
                showSnackbar(
                    dispatch,
                    "Ocorreu um erro. Verifique sua conexão.",
                    "error",
                    4000
                );
                setData((prev) => ({ ...prev, loading: false }));
            }
            setDisplay("");
        });

        if (data) {
            setData((prev) => ({ ...prev, loading: false, passOk: true }));
        }
    };

    const completedFill = display && display.length === 6;
    useEffect(() => {
        const success = passOk === true;
        if (userId && completedFill) {
            runCheckPassword();
        }

        if (completedFill && success) {
            (async () => {
                const token = await getVar("token", store.user);

                const body = { token };
                const { data: newToken } = await getAPI({
                    method: "post",
                    url: getDecryptedToken(),
                    body,
                });

                // wait for the lock animation to end...
                setTimeout(async () => {
                    await authenticate(newToken, { history, role });
                }, 1000);
            })();
        }
    }, [userId, completedFill, passOk]);

    const showInterativeLock = () => (
        <Lock
            backColor={`var(--themeBackground--${
                isBizTeam ? "default" : backColor
            })`}
            needUnlock={passOk}
            isLockLoading={completedFill && loading}
        />
    );

    const showCloseBtn = () => (
        <Link className="no-text-decoration" to={whichPath}>
            <FontAwesomeIcon
                icon="times"
                style={{
                    ...styles.closeBtn,
                    color: needDark ? "var(--mainDark)" : "var(--mainWhite)",
                }}
            />
        </Link>
    );

    const showPasswordArea = () => (
        <Fragment>
            {!passOk && (
                <p
                    className={`${
                        isSmall ? "text-subtitle" : "text-normal m-0"
                    }  ${needDark ? "text-black" : "text-white"} text-center`}
                >
                    Digite sua senha:
                </p>
            )}
            {loading && !passOk ? (
                <p
                    className={`my-3 text-subtitle ${
                        needDark ? "text-black" : "text-white"
                    } text-center`}
                >
                    Analizando...
                </p>
            ) : (
                <Fragment>
                    {passOk ? (
                        <p
                            className={`mt-3 text-subtitle font-weight-bold ${
                                needDark ? "text-black" : "text-white"
                            } text-center`}
                            style={{ marginBottom: 100 }}
                        >
                            Certo!{" "}
                            <FontAwesomeIcon
                                icon="check-circle"
                                style={{
                                    fontSize: 25,
                                    color: needDark
                                        ? "var(--mainDark)"
                                        : "var(--mainWhite)",
                                }}
                                className="ml-2 animated rubberBand delay-1s"
                            />
                        </p>
                    ) : (
                        <section className="mt-1" style={{ marginBottom: 100 }}>
                            <PasswordCircleFields needDark={needDark} />
                        </section>
                    )}
                </Fragment>
            )}
        </Fragment>
    );

    return (
        <section>
            {showInterativeLock()}
            {showCloseBtn()}
            {isBlocked && (
                <AsyncBlocked
                    textColor={needDark ? "text-black" : "text-white"}
                    setLock={setData}
                    lockMin={lockMin}
                />
            )}
            {!isBlocked && (
                <Fragment>
                    {showPasswordArea()}
                    <section className="mt-5 mb-2">
                        <ProtectionMsg backColor={backColor} />
                    </section>
                    <section style={{ marginBottom: 330 }}>
                        <PasswordRecoverBtn
                            textColor={needDark ? "text-black" : "text-white"}
                            role={role}
                        />
                    </section>
                    <NumericKeyboard
                        setDisplay={setDisplay}
                        display={display}
                        addCallback={showNextField}
                        eraseCallback={undoClick}
                        colorP={colorP}
                    />
                </Fragment>
            )}
        </section>
    );
}
