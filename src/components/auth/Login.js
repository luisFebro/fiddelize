import { withRouter } from "react-router-dom";
import { useGlobalContext } from "context";
import Card from "@material-ui/core/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import SafeEnvironmentMsg from '../SafeEnvironmentMsg';
import { doLogin } from "auth/api";
import isThisApp from "utils/window/isThisApp";
import { useBizData } from "init";
import { deleteImage } from "utils/storage/lForage";
import { sendNotification } from "api/frequent";
import { removeVar, getVars, removeVars } from "init/var";
import getColor from "styles/txt";
import RadiusBtn from "../buttons/RadiusBtn";
import KeypadButton from "../modals/keypad";
import Title from "../Title";
import setStorageRegisterDone from "./helpers/setStorageRegisterDone";
import showToast from "../toasts";

const isApp = isThisApp();

function Login({
    history,
    setLoginOrRegister,
    needAppRegister,
    rootClassname,
    isBizTeam,
}) {
    needAppRegister = needAppRegister === "..." ? false : needAppRegister;

    const { uify } = useGlobalContext();

    const { themeSColor, themeBackColor } = useBizData();

    const showTitle = () => (
        <Title
            title="Acessar Conta"
            color="var(--mainWhite)"
            padding="py-2 px-2"
            needShadow
            backgroundColor={`var(--themePDark--${
                isBizTeam ? "default" : themeSColor
            })`}
        />
    );

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
                        backgroundColor={
                            `var(--themeSDark--${isBizTeam}`
                                ? "default"
                                : `${themeSColor})`
                        }
                    />
                </div>
            </p>
        </div>
    );

    return (
        <div className={rootClassname || "my-5"}>
            <Card
                style={{ maxWidth: 330 }}
                className="animated zoomIn fast card-elevation"
            >
                {showTitle()}
                {showKeypadButton()}
            </Card>
            {isApp && needAppRegister && showRegisterForm()}
        </div>
    );
}

export default withRouter(Login);

export async function signInUserData(cpfValue, options = {}) {
    const {
        uify,
        history,
        appPanelUserId = undefined,
        appPanelRole = undefined,
    } = options;

    const objToSend = {
        cpf: cpfValue,
        appPanelUserId,
        appPanelRole,
    };

    const initData = await doLogin(uify, objToSend);
    if (!initData) return null;

    const { currUser } = initData;

    const {
        bizLinkName,
        verificationPass,
        needCliUserWelcomeNotif,
        needAccountPanel,
        // nucleo-equipe data
        pswd, // only verification to redirect to password page
        publicKey, // only verification to redirect to password page
    } = initData;

    const { role, name, userId } = currUser;

    // clean up whatever logo from prior login to set new one (especially another account)
    deleteImage("logos", "app_biz_logo");
    await removeInstantAppAndRegisterData();

    if (role === "nucleo-equipe") {
        await removeVar("disconnectAgent", "user");

        if (!pswd) {
            // redirect user to password page
            return history.push("/t/app/nucleo-equipe/cadastro/senha");
        }
        if (!publicKey) {
            // redirect user to pagseguro agent registration
            return history.push("/t/app/nucleo-equipe/cadastro/pagseguro");
        }

        if (!appPanelUserId) history.push("/t/app/nucleo-equipe/acesso");
    }

    if (role === "cliente-admin") {
        let whichRoute;

        if (!verificationPass) {
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
    if (isApp) return history.push("/mobile-app");
    window.location.href = "/mobile-app?abrir=1";

    return false;
}
// END HELPERS

/* COMMENTS
n1: LESSON: autoComplete is "off" to not allow the browser to autocomplete with suggestions of other searches.other
Disablign this, can enhances security since it does not read past delicate infos.
*/
