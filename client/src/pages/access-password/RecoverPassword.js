import React, { useEffect, useState, Fragment } from "react";
import getAPI, { recoverPassword } from "../../utils/promises/getAPI";
import isThisApp from "../../utils/window/isThisApp";
import { useStoreDispatch } from "easy-peasy";
import { showSnackbar } from "../../redux/actions/snackbarActions";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useBackColor from "../../hooks/useBackColor";
import { useClientAdmin } from "../../hooks/useRoleData";
import selectTxtStyle from "../../utils/biz/selectTxtStyle";
import PasswordCircleFields from "../../components/fields/PasswordCircleFields.js";
import NumericKeyboard from "../../components/keyboards/NumericKeyboard";

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

export default function RecoverPassword({ match, history }) {
    const [display, setDisplay] = useState("");
    const [data, setData] = useState({
        newPswd: null,
        newPswd2: null,
    });
    const { newPswd, newPswd2 } = data;

    const dispatch = useStoreDispatch();
    const styles = getStyles();

    const {
        selfThemeBackColor: backColor,
        selfThemePColor: colorP,
    } = useClientAdmin();

    useBackColor(`var(--themeBackground--${backColor})`);

    const needDark = selectTxtStyle(backColor, { needDarkBool: true });

    useEffect(() => {
        (async () => {
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
        })();
    }, []);

    const showTitle = () => (
        <div className="my-4">
            <p
                className={`text-subtitle ${
                    needDark ? "text-black" : "text-white"
                } text-center font-weight-bold`}
            >
                Recuperar Senha
            </p>
        </div>
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
            <p
                className={`${isSmall ? "text-subtitle" : "text-normal m-0"}  ${
                    needDark ? "text-black" : "text-white"
                } mt-5 text-center`}
            >
                Digite nova senha:
            </p>
            <PasswordCircleFields needDark={needDark} />
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
            {showTitle()}
            {showCloseBtn()}
            {showPasswordArea()}
            <NumericKeyboard
                setDisplay={setDisplay}
                display={display}
                addCallback={showNextField}
                eraseCallback={undoClick}
                colorP={colorP}
            />
        </section>
    );
}

/*
<section className="mt-5 mb-2">
                <ProtectionMsg backColor={backColor} />
            </section>
            <section style={{ marginBottom: 330 }}>
                <PasswordRecoverBtn
                    textColor={needDark ? "text-black" : "text-white"}
                />
            </section>
            <NumericKeyboard
                setDisplay={setDisplay}
                display={display}
                addCallback={showNextField}
                eraseCallback={undoClick}
                colorP={colorP}
            />
 */
