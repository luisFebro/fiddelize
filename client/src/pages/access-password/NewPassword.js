import React, { useEffect, useState, Fragment, useRef } from "react";
import getAPI, {
    recoverPassword,
    changePassword,
    getUniqueId,
} from "../../utils/promises/getAPI";
import isThisApp from "../../utils/window/isThisApp";
import { useStoreDispatch } from "easy-peasy";
import { showSnackbar } from "../../redux/actions/snackbarActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useBackColor from "../../hooks/useBackColor";
import { useClientAdmin } from "../../hooks/useRoleData";
import selectTxtStyle from "../../utils/biz/selectTxtStyle";
import PasswordCircleFields from "../../components/fields/PasswordCircleFields.js";
import NumericKeyboard from "../../components/keyboards/NumericKeyboard";
import ButtonFab from "../../components/buttons/material-ui/ButtonFab";
import useData from "../../hooks/useData";
import RedirectLink from "../../components/RedirectLink";

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

// For recovering and changing user's password
export default function NewPassword({ match, history }) {
    const [display, setDisplay] = useState("");
    const [okContent, setOkContent] = useState(false);

    const changeMode = match.params.token === "mudar" ? true : false;

    const [data, setData] = useState({
        newPswd: null,
        newPswd2: null,
        currPswd: 1, // 1 or 2
    });
    const { newPswd, newPswd2, currPswd } = data;

    const [userId] = useData(["userId"], { trigger: changeMode });

    const dispatch = useStoreDispatch();
    const styles = getStyles();

    const {
        selfThemeBackColor: backColor,
        selfThemePColor: colorP,
        selfThemeSColor: colorS,
    } = useClientAdmin();

    useBackColor(`var(--themeBackground--${backColor})`);

    const needDark = selectTxtStyle(backColor, { needDarkBool: true });

    useEffect(() => {
        const run = async () => {
            const body = {
                checkToken: true,
                token: match.params.token,
            };
            const { data: isValidToken } = await getAPI({
                method: "post",
                url: recoverPassword(),
                body,
            });
            if (!isValidToken) {
                showSnackbar(
                    dispatch,
                    "Esse link já expirou. Solicite um novo.",
                    "error"
                );
                setTimeout(() => {
                    const destiny = isApp
                        ? "/mobile-app"
                        : "/acesso/verificacao";
                    history.push(destiny);
                }, 3000);
            }
        };

        !changeMode && run();
    }, [changeMode]);

    const showTitle = () => (
        <div className="my-4">
            <p
                className={`text-subtitle ${
                    needDark ? "text-black" : "text-white"
                } text-center font-weight-bold`}
            >
                {changeMode ? "Mudar Senha" : "Recuperar Senha"}
            </p>
        </div>
    );

    const showCloseBtn = () => (
        <RedirectLink
            toDashTab={changeMode ? "Ajustes" : undefined}
            goDash={changeMode ? true : false}
            to={!changeMode ? whichPath : undefined}
        >
            <FontAwesomeIcon
                icon="times"
                style={{
                    ...styles.closeBtn,
                    color: needDark ? "var(--mainDark)" : "var(--mainWhite)",
                }}
            />
        </RedirectLink>
    );

    const showPasswordArea = () => {
        const handleTitle = () => {
            if (changeMode) {
                return currPswd === 1
                    ? "Digite senha atual:"
                    : "Digite senha nova:";
            } else {
                return currPswd === 1
                    ? "Digite nova senha:"
                    : "Digite de novo:";
            }
        };

        return (
            <Fragment>
                <p
                    className={`${
                        isSmall ? "mt-5 text-subtitle" : "mt-4 text-normal m-0"
                    }  ${needDark ? "text-black" : "text-white"} text-center`}
                >
                    {handleTitle()}
                </p>
                <PasswordCircleFields needDark={needDark} />
            </Fragment>
        );
    };

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

    let storedPswd = useRef(""); // not clear newPswd after switching to newPswd2
    const restartFields = (restartAll) => {
        setDisplay("");

        const fields = document.querySelectorAll(`.pass-circle`);
        if (fields) {
            fields.forEach((f) => {
                f.classList.remove("d-block");
            });
        }

        if (restartAll) {
            storedPswd.current = "";
            setData({ currPswd: 1, newPswd: null, newPswd2: null });
        }
    };

    useEffect(() => {
        if (currPswd === 1) {
            if (display) {
                storedPswd.current = display;
            }
            setData((prev) => ({ ...prev, newPswd: storedPswd.current }));
        } else {
            setData((prev) => ({ ...prev, newPswd2: display }));
        }

        const newPswdCond = currPswd === 2 && newPswd2 && newPswd2.length === 6;
        const completedFill =
            currPswd === 1 ? display && newPswd.length === 6 : newPswdCond;
        if (completedFill) {
            (async () => {
                const body = {
                    newPswd,
                    newPswd2,
                    token: !changeMode ? match.params.token : undefined,
                    userId: !changeMode ? undefined : userId,
                };

                newPswdCond &&
                    showSnackbar(
                        dispatch,
                        changeMode ? "Mudando..." : "Recuperando...",
                        "warning",
                        2000
                    );
                // LESSON: do not destruct await with catch. otherwise when catch returns will throw an error of data's undefined.
                const finalRes = await getAPI({
                    method: "post",
                    url: changeMode ? changePassword() : recoverPassword(),
                    body,
                    needAuth: changeMode ? true : false,
                }).catch(({ error }) => {
                    showSnackbar(
                        dispatch,
                        error || "Um problema aconteceu. Tente novamente",
                        "error"
                    );
                    restartFields(true);
                });

                if (finalRes) {
                    if (currPswd === 1) {
                        restartFields();
                        setData((prev) => ({ ...prev, currPswd: 2 }));
                    }

                    const { msg } = finalRes.data;
                    if (msg === "pass changed") {
                        setOkContent(true);
                    }
                }
            })();
        }
    }, [currPswd, display, storedPswd, newPswd, newPswd2]);

    const showPendingContent = () => (
        <Fragment>
            {showPasswordArea()}
            <NumericKeyboard
                setDisplay={setDisplay}
                display={display}
                addCallback={showNextField}
                eraseCallback={undoClick}
                colorP={colorP}
            />
        </Fragment>
    );

    const showSuccessContent = () => (
        <section className="animated fadeInUp">
            <p
                className={`text-subtitle ${
                    needDark ? "text-black" : "text-white"
                } mx-3 text-center`}
                style={{ marginTop: 200 }}
            >
                Sua senha foi alterada com sucesso!{" "}
                <FontAwesomeIcon
                    icon="check-circle"
                    style={{
                        fontSize: 25,
                        color: needDark
                            ? "var(--mainDark)"
                            : "var(--mainWhite)",
                    }}
                    className="ml-2 animated rubberBand delay-3s"
                />
            </p>
            <div className="container-center my-5">
                <RedirectLink
                    toDashTab={changeMode ? "Ajustes" : undefined}
                    goDash={changeMode ? true : false}
                    to={!changeMode ? "/senha-de-acesso" : undefined}
                >
                    <ButtonFab
                        title={changeMode ? "VOLTAR" : "ACESSAR"}
                        marginLeft=" "
                        backgroundColor={`var(--themeSDark--${colorS})`}
                        onClick={null}
                        position="relative"
                        variant="extended"
                        size="large"
                    />
                </RedirectLink>
            </div>
        </section>
    );

    return (
        <section>
            {showTitle()}
            {showCloseBtn()}
            {okContent ? showSuccessContent() : showPendingContent()}
        </section>
    );
}
