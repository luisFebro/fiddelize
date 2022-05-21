import { withRouter } from "react-router-dom";
import { useStoreDispatch } from "easy-peasy";
import Card from "@material-ui/core/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../Title";
// import SafeEnvironmentMsg from '../SafeEnvironmentMsg';
import { showSnackbar } from "../../redux/actions/snackbarActions";
import { loginEmail } from "../../redux/actions/authActions";
import { readUser } from "../../redux/actions/userActions";
import KeypadButton from "../modals/keypad";
import isThisApp from "../../utils/window/isThisApp";
import RadiusBtn from "../buttons/RadiusBtn";
import { useClientAdmin } from "../../hooks/useRoleData";
import selectTxtStyle from "../../utils/biz/selectTxtStyle";
import { deleteImage } from "../../utils/storage/lForage";
import { sendNotification } from "../../redux/actions/notificationActions";
import {
    setMultiVar,
    removeVar,
    getVar,
    removeMultiVar,
    store,
} from "../../hooks/storage/useVar";
import getFirstName from "../../utils/string/getFirstName";
import { setStorageRegisterDone } from "./helpers/index";

const isApp = isThisApp();

function Login({
    history,
    setLoginOrRegister,
    dontNeedRegister,
    rootClassname,
    isBizTeam,
}) {
    const {
        selfThemeSColor,
        selfThemePColor,
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

    const showRegisterForm = () =>
        isApp &&
        !dontNeedRegister &&
        false && ( // disable and replaced by dashboard register
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
            {showRegisterForm()}
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
        showSnackbar(dispatch, res.data.msg || res.data.error, "error", 6000);
        return null;
    }

    const {
        msg,
        role,
        name,
        authUserId,
        bizCodeName,
        bizId,
        verificationPass,
        needCliUserWelcomeNotif,
        twoLastCpfDigits,
        gender,
        linkId,
        memberJob,
        needAccountPanel,
        appId,
        // token, token returns undefined unless it is cli-user since all requires password
        // nucleo-equipe data
        primaryAgent,
        agentJob,
        redirectPayGatewayLink,
        uniqueLinkId,
        pswd, // only verification to redirect to password page
        publicKey, // only verification to redirect to password page
    } = res.data;

    // clean up whatever logo from prior login to set new one (especially another account)
    deleteImage("logos", "app_biz_logo");
    await removeInstantAccountData();

    let whichRoute;
    if (role === "cliente-admin") {
        !appPanelUserId &&
            showSnackbar(dispatch, "Iniciando...", "warning", 2000);
        // Pre login store data
        const storeElems = [
            { bizId },
            { role },
            {
                name: getFirstName(name && name.cap(), {
                    addSurname: true,
                }),
            },
            { firstName: getFirstName(name && name.cap()) },
            { userId: authUserId },
            { bizCodeName },
            { twoLastCpfDigits },
            { rememberAccess: true },
            { verifPass: verificationPass },
            { gender },
            { linkId: 0 },
            { appId },
        ];

        await setMultiVar(storeElems, store.user);
        await readUser(dispatch, authUserId, { role }); // this is moved from authActions because avoid reading only user rather admin data or vice-versa...

        if (!verificationPass) {
            await sendWelcomeNotif({
                userId: authUserId,
                role: "cliente-admin",
            });
            // showSnackbar(dispatch, notifRes.data.msg, "success");
            showSnackbar(dispatch, "Verificando...", "warning", 3000);
            setTimeout(
                () =>
                    showSnackbar(
                        dispatch,
                        "Redirecionando...",
                        "warning",
                        4000
                    ),
                2900
            );

            whichRoute = `/${bizCodeName}/nova-senha-verificacao?id=${authUserId}&name=${name}`;
            !appPanelUserId && setTimeout(() => history.push(whichRoute), 5000);
        } else {
            !appPanelUserId && history.push("/senha-de-acesso");
        }
    }

    if (role === "cliente-membro") {
        !appPanelUserId &&
            showSnackbar(dispatch, "Iniciando...", "warning", 2000);
        await removeVar("disconnectCliMember", store.user);

        const storeElems = [
            { bizId },
            { role },
            { gender },
            {
                name: getFirstName(name && name.cap(), {
                    addSurname: true,
                }),
            },
            { firstName: getFirstName(name && name.cap()) },
            { userId: authUserId },
            { rememberAccess: true },
            { linkId },
            { memberJob },
            { appId },
        ];
        await setMultiVar(storeElems, store.user);

        if (needAccountPanel) {
            !appPanelUserId && history.push("/painel-de-apps");
            return;
        }

        !appPanelUserId && history.push("/senha-equipe");
    }

    if (role === "cliente") {
        // the welcome msg is sent in the backend for client-user
        const storeElems = [
            { bizId },
            { role },
            { gender },
            {
                name: getFirstName(name && name.cap(), {
                    addSurname: true,
                }),
            },
            { firstName: getFirstName(name && name.cap()) },
            { userId: authUserId },
            { bizCodeName },
            { rememberAccess: true },
            { appId },
            { success: true }, // other apps are authenticated on password page.
        ];
        await setMultiVar(storeElems, store.user);

        if (needCliUserWelcomeNotif) {
            showSnackbar(dispatch, "Preparando App...", "warning", 3000);

            const cliNotifRes = await sendNotification(authUserId, "welcome", {
                role,
                nT: true,
            });

            if (cliNotifRes.status !== 200)
                return console.log("smt wrong with sendNotification");

            if (needAccountPanel) {
                history.push("/painel-de-apps");
                return;
            }

            !appPanelUserId &&
                handleCliUserPath({ authUserId, dispatch, history });
        } else {
            !appPanelUserId &&
                handleCliUserPath({ authUserId, dispatch, history });
        }
    }

    if (role === "nucleo-equipe") {
        !appPanelUserId &&
            showSnackbar(dispatch, "Iniciando...", "warning", 2000);
        await removeVar("disconnectAgent", store.user);
        // Pre login store data
        const storeElems = [
            { role },
            { userId: authUserId },
            { gender },
            {
                name: getFirstName(name && name.cap(), {
                    addSurname: true,
                }),
            },
            { firstName: getFirstName(name && name.cap()) },
            { rememberAccess: true },
            { primaryAgent },
            { agentJob },
            { redirectPayGatewayLink },
            { uniqueLinkId },
            { appId },
        ];

        await setMultiVar(storeElems, store.user);

        if (!pswd) {
            // redirect user to password page
            return history.push("/t/app/nucleo-equipe/cadastro/senha");
        }
        if (!publicKey) {
            // redirect user to pagseguro agent registration
            return history.push("/t/app/nucleo-equipe/cadastro/pagseguro");
        }

        !appPanelUserId && history.push("/t/app/nucleo-equipe/acesso");
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
    // return showSnackbar(dispatch, notifRes.data.msg, "error");
}

async function removeInstantAccountData() {
    const isInstantAccount = await getVar("isInstantAccount", store.user);
    if (!isInstantAccount) return;

    await removeMultiVar(
        ["isInstantAccount", "instantBizImg", "instantBizName"],
        store.user
    );
    setStorageRegisterDone();
}

function handleCliUserPath({ authUserId, dispatch, history }) {
    readUser(dispatch, authUserId, { role: "cliente" }) // this is moved from authActions because avoid reading only user rather admin data or vice-versa...
        .then((res) => {
            if (isThisApp()) {
                if (res.status !== 200)
                    return showSnackbar(dispatch, res.data.msg, "error");
                showSnackbar(dispatch, "Iniciando...", "warning", 3000);
                history.push("/mobile-app");
            } else {
                window.location.href = "/mobile-app?abrir=1";
            }
        });
}

// END HELPERS

/* ARCHIVES

showSnackbar(
    dispatch,
    "Analisando Credenciais...",
    "warning",
    3000
);
setTimeout(
    () =>
        showSnackbar(
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
        showSnackbar(
            dispatch,
            msg,
            "success",
            3000
        ),
    7000
);

if (role === "admin") {
    showSnackbar(
        dispatch,
        "Analisando Credenciais...",
        "warning",
        3000
    );
    setTimeout(
        () =>
            showSnackbar(
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
        () => showSnackbar(dispatch, msg, "success", 9000),
        7000
    );
}

if(role === "colaborador") {
    showSnackbar(dispatch, "Analisando Credenciais...", 'warning', 3000);
    setTimeout(() => showSnackbar(dispatch, "Redirecionando...", 'warning', 4000), 2900);
    setTimeout(() => history.push(`/colaborador/quadro-administrativo/${authUserId}`), 5000);
    setTimeout(() => showSnackbar(dispatch, msg, 'success', 9000), 7000);
}

else if(!selfMilestoneIcon) {
        whichRoute = `/${bizCodeName}/novo-app/self-service/${authUserId}?nome-cliente=${name}&negocio=${"App dos clientes"}&ponto-premio=500`
        showSnackbar(dispatch, "Conclua o app dos seus clientes", 'warning', 3000);
        setTimeout(() => window.location.href = whichRoute, 2900);

<div className="mx-2 mb-4 text-left">
    <SafeEnvironmentMsg />
</div>


/* COMMENTS
n1: LESSON: autoComplete is "off" to not allow the browser to autocomplete with suggestions of other searches.other
Disablign this, can enhances security since it does not read past delicate infos.
*/
