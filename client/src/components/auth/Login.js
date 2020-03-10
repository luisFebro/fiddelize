import React, { useState } from 'react';
import Title from '../../components/Title';
import { withRouter } from 'react-router-dom';
import { useStoreDispatch } from 'easy-peasy';
import Card from '@material-ui/core/Card';
// import SafeEnvironmentMsg from '../SafeEnvironmentMsg';
import { showComponent } from '../../redux/actions/componentActions';
import { showSnackbar } from '../../redux/actions/snackbarActions';
import { loginEmail } from '../../redux/actions/authActions';
import getDayGreetingBr from '../../utils/getDayGreetingBr';
import PropTypes from 'prop-types';
import KeypadButton from '../modals/keypad';
import isThisApp from '../../utils/window/isThisApp';
import showVanillaToast from '../../components/vanilla-js/toastify/showVanillaToast';
import RadiusBtn from '../../components/buttons/RadiusBtn';

function Login({ history, setLoginOrRegister }) {
    const [cpf, setData] = useState("0");

    const dispatch = useStoreDispatch();

    const signInThisUser = value => {
        const userData = {
            cpf: value,
        };

        loginEmail(dispatch, userData)
        .then(res => {
            if(res.status !== 200) {
                showSnackbar(dispatch, res.data.msg, 'error');
                return null;
            }
            const { msg, role, name, authUserId } = res.data;
            showSnackbar(dispatch, "Analisando Credenciais...", 'warning', 3000);
            if(role === "admin") {
                setTimeout(() => showSnackbar(dispatch, "Redirecionando...", 'warning', 4000), 2900);
                setTimeout(() => history.push("/admin/painel-de-controle"), 5000);
                setTimeout(() => showSnackbar(dispatch, msg, 'success', 9000), 7000);
            }
            if(role === "cliente-admin") {
                    setTimeout(() => showSnackbar(dispatch, "Redirecionando...", 'warning', 4000), 2900);
                    setTimeout(() => history.push(`/colaborador/quadro-administrativo/${authUserId}`), 5000);
                    setTimeout(() => showSnackbar(dispatch, msg, 'success', 9000), 7000);
            }
            // if(role === "colaborador") {
            //     setTimeout(() => showSnackbar(dispatch, "Redirecionando...", 'warning', 4000), 2900);
            //     setTimeout(() => history.push(`/colaborador/quadro-administrativo/${authUserId}`), 5000);
            //     setTimeout(() => showSnackbar(dispatch, msg, 'success', 9000), 7000);
            // }
            if(role === "cliente") {
                if(true) {
                    history.push("/mobile-app");
                } else {
                    showComponent(dispatch, "purchaseValue");
                    history.push("/cliente/pontos-fidelidade");
                }
            }
        })
    };

    const showTitle = () => (
        <Title
            title="Acessar Conta"
            color="var(--mainWhite)"
            padding="p-2"
            backgroundColor="var(--themePDark)"
        />
    );

    const showKeypadButton = () => (
        <div className="mt-3 mb-2 animated jackInTheBox slow delay-1s d-flex justify-content-center">
            <KeypadButton
                title="Informe o seu CPF"
                titleIcon="fas fa-list-ol"
                keyboardType="cpf"
                setSelectedValue={setData}
                confirmFunction={signInThisUser}
            />
        </div>
    );

    const showRegisterForm = () => (
        <p
            className="text-small text-center font-weight-bold  p-2"
        >
            Novo Usuário?<br/>Faça seu cadastro{" "}
            <RadiusBtn title="aqui" onClick={() => setLoginOrRegister("register")} />
        </p>
    );

    return (
        <Card style={{ maxWidth: 330 }} className="animated zoomIn fast card-elevation">
            {showTitle()}
            {showKeypadButton()}
            {showRegisterForm()}
        </Card>
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