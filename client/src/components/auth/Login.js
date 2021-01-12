import React from "react";
import Title from "../../components/Title";
import { withRouter } from "react-router-dom";
import { useStoreDispatch } from "easy-peasy";
import Card from "@material-ui/core/Card";
// import SafeEnvironmentMsg from '../SafeEnvironmentMsg';
import { showComponent } from "../../redux/actions/componentActions";
import { showSnackbar } from "../../redux/actions/snackbarActions";
import { loginEmail } from "../../redux/actions/authActions";
import { readUser } from "../../redux/actions/userActions";
import PropTypes from "prop-types";
import KeypadButton from "../modals/keypad";
import isThisApp from "../../utils/window/isThisApp";
import showVanillaToast from "../../components/vanilla-js/toastify/showVanillaToast";
import RadiusBtn from "../../components/buttons/RadiusBtn";
import { CLIENT_URL } from "../../config/clientUrl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useClientAdmin } from "../../hooks/useRoleData";
import selectTxtStyle from "../../utils/biz/selectTxtStyle";
import { deleteImage } from "../../utils/storage/lForage";
import useCount from "../../hooks/useCount";
import { sendNotification } from "../../redux/actions/notificationActions";
import {
    setMultiVar,
    removeVar,
    getVar,
    removeMultiVar,
    store,
} from "../../hooks/storage/useVar";
import getFirstName from "../../utils/string/getFirstName";

const isApp = isThisApp();

const sendWelcomeNotif = async ({ userId, role = "ambos-clientes" }) => {
    // "ambos-clientes" add an welcome obj to cli-user as weel for test mode.
    const notifOptions = {
        role,
        noToken: true, // allow notification without being loggedin
    };
    return await sendNotification(userId, "welcome", notifOptions);
    // if (notifRes.status !== 200)
    // return showSnackbar(dispatch, notifRes.data.msg, "error");
};

function Login({
    history,
    setLoginOrRegister,
    dontNeedRegister,
    rootClassname,
    isBizTeam,
}) {
    // useCount("Login.js"); // Initial RT 2 // After logout cli-user = 26
    const dispatch = useStoreDispatch();
    // let { roleWhichDownloaded } = useAppSystem();
    // disable restriction of user during early estages of tests.
    // roleWhichDownloaded = "";

    const {
        selfThemeSColor,
        selfThemePColor,
        selfThemeBackColor,
    } = useClientAdmin();

    const signInThisUser = async (value) => {
        const userData = {
            cpf: value,
            // roleWhichDownloaded,
        };

        const res = await loginEmail(dispatch, userData);

        if (res.status !== 200) {
            showSnackbar(
                dispatch,
                res.data.msg || res.data.error,
                "error",
                6000
            );
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
            token,
            gender,
            linkId,
            memberJob,
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

        let whichRoute;
        if (role === "cliente-admin") {
            showSnackbar(dispatch, "Carregando...", "warning", 2000);
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
            ];

            await setMultiVar(storeElems, store.user);
            await readUser(dispatch, authUserId, { role }); // this is moved from authActions because avoid reading only user rather admin data or vice-versa...

            if (!verificationPass) {
                await sendWelcomeNotif({
                    userId: authUserId,
                    role: "ambos-clientes",
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
                setTimeout(() => history.push(whichRoute), 5000);
            } else {
                history.push("/senha-de-acesso");
            }
        }

        if (role === "cliente-membro") {
            showSnackbar(dispatch, "Carregando...", "warning", 2000);
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
            ];
            setMultiVar(storeElems, store.user);

            await setMultiVar(storeElems, store.user);
            await readUser(dispatch, authUserId, { role });

            history.push("/senha-equipe");
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
            ];
            setMultiVar(storeElems, store.user);

            if (needCliUserWelcomeNotif) {
                showSnackbar(dispatch, "Preparando App...", "warning", 3000);

                const cliNotifRes = await sendNotification(
                    authUserId,
                    "welcome",
                    {
                        role,
                        nT: true,
                    }
                );

                if (cliNotifRes.status !== 200)
                    return console.log("smt wrong with sendNotification");

                handleCliUserPath({ authUserId, dispatch, history });
            } else {
                handleCliUserPath({ authUserId, dispatch, history });
            }
        }

        if (role === "nucleo-equipe") {
            showSnackbar(dispatch, "Carregando...", "warning", 2000);
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
            ];

            await setMultiVar(storeElems, store.user);

            if (!pswd) {
                //redirect user to password page
                return history.push("/t/app/nucleo-equipe/cadastro/senha");
            }
            if (!publicKey) {
                //redirect user to pagseguro agent registration
                return history.push("/t/app/nucleo-equipe/cadastro/pagseguro");
            }

            history.push("/t/app/nucleo-equipe/acesso");
        }

        // remove instant account notification
        (async () => {
            const isInstantAccount = await getVar(
                "isInstantAccount",
                store.user
            );
            if (isInstantAccount) {
                await removeMultiVar(
                    ["isInstantAccount", "instantBizImg", "instantBizName"],
                    store.user
                );
            }
        })();
    };

    const showTitle = () => (
        <Title
            title="Acessar Conta"
            color="var(--mainWhite)"
            padding="py-2 px-2"
            needShadow={true}
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
                confirmFunction={signInThisUser}
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
                                "var(--themeSDark--" + isBizTeam
                                    ? "default"
                                    : selfThemeSColor + ")"
                            }
                        />
                    </div>
                </p>
            </div>
        );

    return (
        <div className={rootClassname ? rootClassname : "my-5"}>
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

// HELPERS
function handleCliUserPath({ authUserId, dispatch, history }) {
    readUser(dispatch, authUserId, { role: "cliente" }) // this is moved from authActions because avoid reading only user rather admin data or vice-versa...
        .then((res) => {
            if (isThisApp()) {
                if (res.status !== 200)
                    return showSnackbar(dispatch, res.data.msg, "error");
                showSnackbar(dispatch, "Carregando...", "warning", 3000);
                history.push("/mobile-app");
            } else {
                showComponent(dispatch, "purchaseValue");
                history.push("/cliente/pontos-fidelidade");
            }
        });
}

// END HELPERS

/*ARCHIVES

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
