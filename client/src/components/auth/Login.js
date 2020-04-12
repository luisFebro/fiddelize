import React from 'react';
import Title from '../../components/Title';
import { withRouter } from 'react-router-dom';
import { useStoreDispatch } from 'easy-peasy';
import Card from '@material-ui/core/Card';
// import SafeEnvironmentMsg from '../SafeEnvironmentMsg';
import { showComponent } from '../../redux/actions/componentActions';
import { showSnackbar } from '../../redux/actions/snackbarActions';
import { loginEmail } from '../../redux/actions/authActions';
import { readUser } from '../../redux/actions/userActions';
import getDayGreetingBr from '../../utils/getDayGreetingBr';
import PropTypes from 'prop-types';
import KeypadButton from '../modals/keypad';
import isThisApp from '../../utils/window/isThisApp';
import showVanillaToast from '../../components/vanilla-js/toastify/showVanillaToast';
import RadiusBtn from '../../components/buttons/RadiusBtn';
import { CLIENT_URL } from '../../config/clientUrl';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppSystem } from '../../hooks/useRoleData';

function Login({ history, setLoginOrRegister }) {
    const dispatch = useStoreDispatch();
    const { roleWhichDownloaded } = useAppSystem();

    const signInThisUser = value => {
        const userData = {
            cpf: value,
            roleWhichDownloaded,
        };

        loginEmail(dispatch, userData)
        .then(res => {
            if(res.status !== 200) {
                showSnackbar(dispatch, res.data.msg, 'error');
                return null;
            }

            const {
                msg,
                role,
                name,
                authUserId,
                bizId,
                bizCodeName,
                verificationPass,
            } = res.data;

            if(role === "admin") {
                showSnackbar(dispatch, "Analisando Credenciais...", 'warning', 3000);
                setTimeout(() => showSnackbar(dispatch, "Redirecionando...", 'warning', 4000), 2900);
                setTimeout(() => history.push("/admin/painel-de-controle"), 5000);
                setTimeout(() => showSnackbar(dispatch, msg, 'success', 9000), 7000);
            }

            if(role === "cliente-admin") {
                let whichRoute;
                readUser(dispatch, authUserId) // this is moved from authActions because avoid reading only user rather admin data or vice-versa...
                .then(res => {
                    if(verificationPass) {
                        whichRoute = `/${bizCodeName}/cliente-admin/painel-de-controle`;
                        if(isThisApp()) {
                            setTimeout(() => showSnackbar(dispatch, msg, 'success', 3000), 1400);
                        } else {
                            showSnackbar(dispatch, "Analisando Credenciais...", 'warning', 3000);
                            setTimeout(() => showSnackbar(dispatch, "Redirecionando...", 'warning', 4000), 2900);
                            setTimeout(() => history.push(whichRoute), 5000);
                            setTimeout(() => showSnackbar(dispatch, msg, 'success', 3000), 7000);
                        }
                    } else {
                        showSnackbar(dispatch, "Verificando...", 'warning', 3000);
                        setTimeout(() => showSnackbar(dispatch, "Redirecionando...", 'warning', 4000), 2900);
                        whichRoute = `/${bizCodeName}/nova-senha-verificacao?id=${authUserId}&name=${name}`;
                        setTimeout(() => history.push(whichRoute), 5000);
                    }
                })
            }

            if(role === "cliente") {
                // window.location.href = "/mobile-app"
                readUser(dispatch, authUserId) // this is moved from authActions because avoid reading only user rather admin data or vice-versa...
                .then(res => {
                    if(isThisApp()) {
                            if(res.status !== 200) return showSnackbar(dispatch, res.data.msg, 'error')
                            showSnackbar(dispatch, "Carregando...", 'warning', 3000);
                            history.push("/mobile-app");

                    } else {
                        showComponent(dispatch, "purchaseValue");
                        history.push("/cliente/pontos-fidelidade");
                    }
                })
            }
            // if(role === "colaborador") {
            // showSnackbar(dispatch, "Analisando Credenciais...", 'warning', 3000);
            //     setTimeout(() => showSnackbar(dispatch, "Redirecionando...", 'warning', 4000), 2900);
            //     setTimeout(() => history.push(`/colaborador/quadro-administrativo/${authUserId}`), 5000);
            //     setTimeout(() => showSnackbar(dispatch, msg, 'success', 9000), 7000);
            // }
        })
    };

    const showTitle = () => (
        <Title
            title="Acessar Conta"
            color="var(--mainWhite)"
            padding="py-2 px-2"
            backgroundColor="var(--themePDark)"
        />
    );

    const showKeypadButton = () => (
        <div className="mt-3 mb-2 animated jackInTheBox slower delay-1s d-flex justify-content-center">
            <KeypadButton
                title="Informe o seu CPF"
                titleIcon={<FontAwesomeIcon icon="list-ol" />}
                keyboardType="cpf"
                confirmFunction={signInThisUser}
            />
        </div>
    );

    const showRegisterForm = () => (
        isThisApp() && (
            <div
                className="animated zoomIn delay-2s p-2 mt-3"
            >
                <p
                    className="text-white font-weight-bold text-small text-shadow"
                >
                    Novo Usuário?<br/>Faça seu cadastro{" "}
                    <RadiusBtn size="small" title="aqui" onClick={() => setLoginOrRegister("register")} />
                </p>
            </div>
        )
    );

    return (
        <div className="my-5">
            <Card style={{ maxWidth: 330 }} className="animated zoomIn fast card-elevation">
                {showTitle()}
                {showKeypadButton()}
            </Card>
            {showRegisterForm()}
        </div>
    );
}

export default withRouter(Login);


/*ARCHIVES
<div className="mx-2 mb-4 text-left">
    <SafeEnvironmentMsg />
</div>
*/


/* COMMENTS
n1: LESSON: autoComplete is "off" to not allow the browser to autocomplete with suggestions of other searches.other
Disablign this, can enhances security since it does not read past delicate infos.
*/