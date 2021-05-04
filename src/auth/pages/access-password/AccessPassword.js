import { useState, useEffect, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import authenticate from "auth/authenticate";
import NumericKeyboard from "components/keyboards/NumericKeyboard";
import isThisApp from "utils/window/isThisApp";
import useData, { useBizData } from "init";
import useBackColor from "hooks/useBackColor";
import useScrollUp from "hooks/scroll/useScrollUp";
import showToast from "components/toasts";
import getAPI, { checkPassword, createTk } from "utils/promises/getAPI";
import selectTxtStyle from "utils/biz/selectTxtStyle";
import PasswordCircleFields from "components/fields/PasswordCircleFields";
import { Load } from "components/code-splitting/LoadableComp";
import PasswordRecoverBtn from "./password-recover-modal/PasswordRecoverBtn";
import Lock from "./interative-lock/Lock";
import ProtectionMsg from "./ProtectionMsg";

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
        bizId,
        themeBackColor: backColor,
        themePColor: colorP,
    } = useBizData();

    const styles = getStyles();

    const needDark = selectTxtStyle(backColor, { needDarkBool: true });
    useBackColor(
        `var(--themeBackground--${isBizTeam ? "default" : backColor})`
    );
    useScrollUp();

    const [userId] = useData(["userId"], { dots: false });

    useEffect(() => {
        if (!userId) return;

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

        Promise.all([checkIfLocked()]).then((res) => {
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
        const counter = display.length;
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
        const checkRes = await getAPI({
            method: "post",
            url: checkPassword(),
            body,
        }).catch((error) => {
            const wrongPassMsgCond = error === false;
            if (wrongPassMsgCond) {
                showToast("Senha de acesso inválida.", { type: "error" });
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
                showToast("Ocorreu um erro. Verifique sua conexão.", {
                    type: "error",
                });
                setData((prev) => ({ ...prev, loading: false }));
            }
            setDisplay("");
        });

        if (checkRes && checkRes.data) {
            setData((prev) => ({ ...prev, loading: false, passOk: true }));
        }
    };

    const completedFill = display && display.length === 6;
    useEffect(() => {
        const success = passOk === true;
        if (userId && completedFill) {
            runCheckPassword();
        }

        const allIdsOn = userId && bizId;

        if (allIdsOn && completedFill && success) {
            (async () => {
                const body = {
                    _id: userId,
                    bizId,
                    role,
                };
                const { data: newToken } = await getAPI({
                    method: "post",
                    url: createTk(),
                    body,
                });

                // wait for the lock animation to end...
                setTimeout(async () => {
                    await authenticate(newToken, { history, role });
                }, 1000);
            })();
        }
    }, [userId, bizId, completedFill, passOk]);

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
