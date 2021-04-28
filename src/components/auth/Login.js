import { withRouter } from "react-router-dom";
import { useStoreDispatch } from "easy-peasy";
import Card from "@material-ui/core/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import SafeEnvironmentMsg from '../SafeEnvironmentMsg';
import { loginEmail } from "redux/actions/authActions";
import isThisApp from "utils/window/isThisApp";
import { useClientAdmin } from "hooks/useRoleData";
import selectTxtStyle from "utils/biz/selectTxtStyle";
import { deleteImage } from "utils/storage/lForage";
import { sendNotification } from "redux/actions/notificationActions";
import {
    removeVar,
    getMultiVar,
    removeMultiVar,
    store,
} from "hooks/storage/useVar";
import getFirstName from "utils/string/getFirstName";
import setInitData from "init-data/setInitData";
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

    const {
        selfThemeSColor,
        // selfThemePColor,
        selfThemeBackColor,
    } = useClientAdmin();

    const dispatch = useStoreDispatch();

    const showTitle = () => (
        <Title
            title="Acessar Conta"
            color="var(--mainWhite)"
            padding="py-2 px-2"
            needShadow
            backgroundColor={`var(--themePDark--${
                isBizTeam ? "default" : selfThemeSColor
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
                confirmPayload={{ history, dispatch }}
                backgroundColor={`var(--themeSDark--${
                    isBizTeam ? "default" : selfThemeSColor
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
                className={`${selectTxtStyle(
                    isBizTeam ? "default" : selfThemeBackColor || "default"
                )} d-flex justify-content-center text-small`}
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
                                : `${selfThemeSColor})`
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
        dispatch,
        history,
        appPanelUserId = undefined,
        appPanelRole = undefined,
    } = options;

    const objToSend = {
        cpf: cpfValue,
        appPanelUserId,
        appPanelRole,
    };

    const res = await loginEmail(dispatch, objToSend);

    if (res.status !== 200) {
        showToast(res.data.msg || res.data.error, { type: "error" });
        return null;
    }

    const initData = res.data;
    const currUser = res.data.currUser;

    const {
        bizCodeName,
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
        if (!appPanelUserId) showToast("Iniciando...", { dur: 5000 });
        await removeVar("disconnectAgent", store.user);

        await setInitData("nucleo-equipe", { initData, dispatch });

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

        if (!appPanelUserId) showToast("Iniciando...", { dur: 5000 });

        await setInitData("cliente-admin", { initData, dispatch });

        if (!verificationPass) {
            await sendWelcomeNotif({
                userId,
                role: "cliente-admin",
            });
            showToast("Verificando...", { dur: 5000 });
            setTimeout(() => showToast("Redirecionando..."), 2900);

            whichRoute = `/${bizCodeName}/nova-senha-verificacao?id=${userId}&name=${name}`;
            if (!appPanelUserId)
                setTimeout(() => history.push(whichRoute), 5000);
        }

        if (!appPanelUserId) history.push("/senha-de-acesso");
    }

    if (role === "cliente-membro") {
        if (!appPanelUserId) showToast("Iniciando...", { dur: 5000 });
        await removeVar("disconnectCliMember", store.user);

        await setInitData("cliente-membro", { initData, dispatch });

        if (needAccountPanel) {
            if (!appPanelUserId) history.push("/painel-de-apps");
            return null;
        }

        if (!appPanelUserId) history.push("/senha-equipe");
    }

    if (role === "cliente") {
        await setInitData("cliente", { initData, dispatch });

        if (needCliUserWelcomeNotif) {
            showToast("Preparando App...");

            const cliNotifRes = await sendNotification(userId, "welcome", {
                role,
                nT: true,
            });

            if (cliNotifRes.status !== 200)
                return console.log("smt wrong with sendNotification");

            if (needAccountPanel) {
                return history.push("/painel-de-apps");
            }
        }

        if (!appPanelUserId) handleCliUserPath(history);
    }
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
    const [isInstantApp, needAppRegister] = await getMultiVar(
        ["isInstantApp", "needAppRegister"],
        store.user
    );

    if (!needAppRegister) return;
    await setStorageRegisterDone();

    if (!isInstantApp) return;
    await removeMultiVar(
        ["isInstantApp", "instantBizImg", "instantBizName"],
        store.user
    );
}

async function handleCliUserPath(history) {
    if (isApp) return history.push("/mobile-app");
    window.location.href = "/mobile-app?abrir=1";

    return false;
}
// END HELPERS

/* ARCHIVES



showToast(
    dispatch,
    "Analisando Credenciais...",
    "warning",
    3000
);
setTimeout(
    () =>
        showToast(
            dispatch,
            "Redirecionando...",
            "warning",
            4000
        ),
    2900
);
setTimeout(
    () => history.push(whichRoute),
    5000
);
setTimeout(
    () =>
        showToast(
            dispatch,
            msg,
            "success",
            3000
        ),
    7000
);

if (role === "admin") {
    showToast(
        dispatch,
        "Analisando Credenciais...",
        "warning",
        3000
    );
    setTimeout(
        () =>
            showToast(
                dispatch,
                "Redirecionando...",
                "warning",
                4000
            ),
        2900
    );
    setTimeout(
        () => history.push("/admin/painel-de-controle"),
        5000
    );
    setTimeout(
        () => showToast(dispatch, msg, "success", 9000),
        7000
    );
}

if(role === "colaborador") {
    showToast(dispatch, "Analisando Credenciais...", 'warning', 3000);
    setTimeout(() => showToast(dispatch, "Redirecionando...", 'warning', 4000), 2900);
    setTimeout(() => history.push(`/colaborador/quadro-administrativo/${userId}`), 5000);
    setTimeout(() => showToast(dispatch, msg, 'success', 9000), 7000);
}

else if(!selfMilestoneIcon) {
        whichRoute = `/${bizCodeName}/novo-app/self-service/${userId}?nome-cliente=${name}&negocio=${"App dos clientes"}&ponto-premio=500`
        showToast(dispatch, "Conclua o app dos seus clientes", 'warning', 3000);
        setTimeout(() => window.location.href = whichRoute, 2900);

<div className="mx-2 mb-4 text-left">
    <SafeEnvironmentMsg />
</div>


/* COMMENTS
n1: LESSON: autoComplete is "off" to not allow the browser to autocomplete with suggestions of other searches.other
Disablign this, can enhances security since it does not read past delicate infos.
*/
