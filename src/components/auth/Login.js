import { useState } from "react";
import { withRouter } from "react-router-dom";
import { useGlobalContext } from "context";
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import EmailIcon from "@material-ui/icons/Email";
import { doLogin } from "auth/api";
import isThisApp from "utils/window/isThisApp";
import { useBizData } from "init";
import { deleteImage } from "utils/storage/lForage";
import { sendNotification } from "api/frequent";
import { setVar, removeVar, getVars, removeVars } from "init/var";
import getColor from "styles/txt";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import handleChange from "utils/form/use-state/handleChange";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RadiusBtn from "../buttons/RadiusBtn";
import Title from "../Title";
import setStorageRegisterDone from "./helpers/setStorageRegisterDone";
import showToast from "../toasts";
// import KeypadButton from "../modals/keypad";

const isApp = isThisApp();
const isSmall = window.Helper.isSmallScreen();

const getStyles = () => ({
    fieldForm: {
        backgroundColor: "var(--mainWhite)",
        color: "var(--themeP)",
        zIndex: 2000,
        font: "normal 1em Poppins, sans-serif",
    },
    helperFromField: {
        color: "grey",
        fontFamily: "Poppins, sans-serif",
        fontSize: isSmall ? ".8em" : ".6em",
    },
    card: {
        margin: "auto",
        width: "90%",
        maxWidth: isSmall ? "" : 360,
        boxShadow: "0 31px 120px -6px rgba(0, 0, 0, 0.35)",
    },
});

function Login({
    setLoginOrRegister,
    needAppRegister,
    rootClassname,
    isBizTeam,
    history,
}) {
    needAppRegister = needAppRegister === "..." ? false : needAppRegister;

    const styles = getStyles();
    const { uify } = useGlobalContext();

    const [data, setData] = useState({
        email: "",
    });

    const { email } = data;

    // detecting field errors
    const [fieldError, setFieldError] = useState(null);
    const errorEmail = fieldError && fieldError.email;

    const { themeSColor, themeBackColor } = useBizData();

    const showTitle = () => (
        <Title
            title="Acesso"
            color="var(--mainWhite)"
            padding="py-2 px-2"
            needShadow
            backgroundColor={`var(--themePDark--${
                isBizTeam ? "default" : themeSColor
            })`}
        />
    );

    const handleLoginAndRegister = () => {
        setLoginOrRegister("register");
    };

    const showRegisterForm = () => (
        <div className="animated zoomIn delay-2s p-2 mt-3">
            <p
                className={`${
                    getColor(isBizTeam ? "default" : themeBackColor).txtColor
                } d-flex justify-content-center text-small`}
            >
                <span style={{ fontWeight: "bolder" }}>
                    Novo Cliente?
                    <br />
                    Faça cadastro{"  "}
                </span>
                <div className="pl-2">
                    <RadiusBtn
                        size="small"
                        title="aqui"
                        onClick={handleLoginAndRegister}
                        backgroundColor={`var(--themeSDark--${
                            isBizTeam ? "default" : `${themeSColor}`
                        })`}
                    />
                </div>
            </p>
        </div>
    );

    const showForm = () => (
        <form
            style={{ margin: "auto", width: "90%" }}
            className="mb-5 text-p text-normal"
            onBlur={() => setFieldError(null)}
        >
            <section id="field1">
                <div className="mt-3">
                    Email
                    <TextField
                        required
                        margin="dense"
                        onChange={handleChange(setData, data)}
                        onKeyPress={(e) => null}
                        onBlur={() => null}
                        // handleNextField(e, "field4", { event: "onBlur" })
                        // }
                        error={!!errorEmail}
                        name="email"
                        variant="outlined"
                        value={email}
                        type="email"
                        autoComplete="off"
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailIcon />
                                </InputAdornment>
                            ),
                            style: styles.fieldForm,
                            id: "value4",
                        }}
                    />
                </div>
            </section>
        </form>
    );

    const dataUser = {
        uify,
        history,
    };

    const showButtonActions = () => (
        <div className="my-4 mx-5 container-center">
            <ButtonFab
                title="Acessar"
                width="100%"
                iconFontAwesome={
                    <FontAwesomeIcon
                        icon="paper-plane"
                        style={{
                            fontSize: 30,
                        }}
                    />
                }
                backgroundColor="var(--themeSDark)"
                onClick={() => signInUserData(email, dataUser)}
                position="relative"
                variant="extended"
                size="large"
            />
        </div>
    );

    return (
        <div className={rootClassname || "my-5"}>
            <Card
                style={{ maxWidth: 330 }}
                className="animated zoomIn fast card-elevation"
            >
                {showTitle()}
                {showForm()}
                {showButtonActions()}
            </Card>
            {isApp && needAppRegister && showRegisterForm()}
        </div>
    );
}

export default withRouter(Login);

export async function signInUserData(emailValue, options = {}) {
    const {
        uify,
        history,
        appPanelUserId = undefined,
        appPanelRole = undefined,
    } = options;

    const objToSend = {
        email: emailValue,
        appPanelUserId,
        appPanelRole,
    };

    const initData = await doLogin(uify, objToSend);
    if (!initData) return null;

    const { currUser } = initData;

    const {
        bizLinkName,
        needCliUserWelcomeNotif,
        needAccountPanel,
        pswd, // nucleo-equipe and cli-admin
        publicKey, // nucleo-equipe - only verification to redirect to password page
    } = initData;

    const { role, name, userId } = currUser;

    // clean up whatever logo from prior login to set new one (especially another account)
    deleteImage("logos", "app_biz_logo");
    await removeInstantAppAndRegisterData();

    if (role === "nucleo-equipe") {
        await removeVar("disconnectAgent", "user");

        if (!pswd) {
            // redirect user to password page
            setVar({ donePswd: false }).then(() => {
                return history.push("/t/app/nucleo-equipe/cadastro/senha");
            });
        }
        if (!publicKey) {
            // redirect user to pagseguro agent registration
            return history.push("/t/app/nucleo-equipe/cadastro/pagseguro");
        }

        if (!appPanelUserId) history.push("/t/app/nucleo-equipe/acesso");
    }

    if (role === "cliente-admin") {
        let whichRoute;

        if (!pswd) {
            await sendWelcomeNotif({
                userId,
                role: "cliente-admin",
            });
            showToast("Verificando...", { dur: 5000 });
            setTimeout(() => showToast("Redirecionando..."), 2900);

            whichRoute = `/${bizLinkName}/nova-senha-verificacao?id=${userId}&name=${name}`;
            if (!appPanelUserId)
                setTimeout(() => history.push(whichRoute), 5000);
        }

        if (!appPanelUserId) history.push("/senha-de-acesso");
    }

    if (role === "cliente-membro") {
        await removeVar("disconnectCliMember", "user");

        if (needAccountPanel) {
            if (!appPanelUserId) history.push("/painel-de-apps");
            return null;
        }

        if (!appPanelUserId) history.push("/senha-equipe");
    }

    if (role === "cliente") {
        if (needCliUserWelcomeNotif) {
            showToast("Preparando App...");

            await sendNotification(userId, "welcome", {
                role,
                nT: true,
            });

            if (needAccountPanel) {
                return history.push("/painel-de-apps");
            }
        }

        if (!appPanelUserId) handleCliUserPath(history);
    }

    return null;
}

// HELPERS
async function sendWelcomeNotif({ userId, role = "cliente-admin" }) {
    const notifOptions = {
        role,
        noToken: true, // allow notification without being loggedin
    };
    return await sendNotification(userId, "welcome", notifOptions);
    // if (notifRes.status !== 200)
}

async function removeInstantAppAndRegisterData() {
    // make sure that only when there is a pending registration is triggered to remove data
    const [isInstantApp, needAppRegister] = await getVars(
        ["isInstantApp", "needAppRegister"],
        "user"
    );

    if (!needAppRegister) return;
    await setStorageRegisterDone();

    if (!isInstantApp) return;
    await removeVars(
        ["isInstantApp", "instantBizImg", "instantBizName"],
        "user"
    );
}

async function handleCliUserPath(history) {
    if (isApp) return history.push("/app");
    window.location.href = "/app";

    return false;
}
// END HELPERS

/* COMMENTS
n1: LESSON: autoComplete is "off" to not allow the browser to autocomplete with suggestions of other searches.other
Disablign this, can enhances security since it does not read past delicate infos.
*/

/* ARCHIVES

const showKeypadButton = () => (
    <div className="mt-3 mb-2 animated fadeInDown normal delay-1s d-flex justify-content-center">
        <KeypadButton
            title="Informe CPF"
            titleIcon={<FontAwesomeIcon icon="list-ol" />}
            keyboardType="cpf"
            confirmFunction={signInUserData}
            confirmPayload={{ history, uify }}
            backgroundColor={`var(--themeSDark--${
                isBizTeam ? "default" : themeSColor
            })`}
        />
    </div>
);

 */
