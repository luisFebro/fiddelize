import { useEffect, useState, Fragment, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import getAPI, { recoverPassword, changePassword } from "api";
import isThisApp from "utils/window/isThisApp";
import showToast from "components/toasts";
import useBackColor from "hooks/useBackColor";
import useData, { useBizData } from "init";
import PasswordCircleFields from "components/fields/PasswordCircleFields.js";
import NumericKeyboard from "components/keyboards/NumericKeyboard";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import RedirectLink from "components/RedirectLink";

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
export default function NewPassword({ location, match, history }) {
    const [display, setDisplay] = useState("");
    const [okContent, setOkContent] = useState(false);

    const changeMode = match.params.token === "mudar";
    const isBizTeam = location.search.includes("?nucleo-equipe=1");
    const role = isBizTeam ? "nucleo-equipe" : "cliente-admin";

    const [data, setData] = useState({
        newPswd: null,
        newPswd2: null,
        currPswd: 1, // 1 or 2
    });
    const { newPswd, newPswd2, currPswd } = data;

    const [userId] = useData(["userId"], { trigger: changeMode });

    const styles = getStyles();

    const {
        themeBackColor: backColor,
        themePColor: colorP,
        themeSColor: colorS,
        needDark,
    } = useBizData();

    useBackColor(`var(--themeBackground--${backColor})`);

    useEffect(() => {
        const run = async () => {
            const body = {
                checkToken: true,
                token: match.params.token,
                role,
            };
            const isValidToken = await getAPI({
                method: "post",
                url: recoverPassword(),
                body,
            });
            if (!isValidToken) {
                showToast("Esse link já expirou. Solicite um novo.", {
                    type: "error",
                });
                setTimeout(() => {
                    const destiny = isApp
                        ? "/mobile-app"
                        : "/acesso/verificacao";
                    history.push(destiny);
                }, 3000);
            }
        };

        if (!changeMode) run();
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
            goDash={!!changeMode}
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
            }
            return currPswd === 1 ? "Digite nova senha:" : "Digite de novo:";
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
        const counter = display.length;
        const currTypingField = document.querySelector(
            `.pass-block-${counter}`
        );
        if (currTypingField) currTypingField.classList.toggle("d-block");
    };

    const storedPswd = useRef(""); // not clear newPswd after switching to newPswd2
    const restartFields = (restartAll) => {
        setDisplay("");

        const fields = document.querySelectorAll(".pass-circle");
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
                    role,
                };

                newPswdCond &&
                    showToast(changeMode ? "Mudando..." : "Recuperando...");
                // LESSON: do not destruct await with catch. otherwise when catch returns will throw an error of data's undefined.
                const finalData = await getAPI({
                    method: "post",
                    url: changeMode ? changePassword() : recoverPassword(),
                    body,
                    needAuth: !!changeMode,
                }).catch((error) => {
                    showToast(
                        error || "Um problema aconteceu. Tente novamente",
                        { type: "error" }
                    );
                    restartFields(true);
                });

                if (currPswd === 1) {
                    restartFields();
                    setData((prev) => ({ ...prev, currPswd: 2 }));
                }

                const { msg } = finalData;
                if (msg === "pass changed") {
                    setOkContent(true);
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

    const finalDestiny = isBizTeam
        ? "/t/app/nucleo-equipe/acesso"
        : "/senha-de-acesso";
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
                    goDash={!!changeMode}
                    to={!changeMode ? finalDestiny : undefined}
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
