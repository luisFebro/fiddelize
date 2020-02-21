import React, { useState } from 'react';
import Title from '../../components/Title';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useStoreDispatch } from 'easy-peasy';
import Card from '@material-ui/core/Card';
import SafeEnvironmentMsg from '../SafeEnvironmentMsg';
import { showComponent } from '../../redux/actions/componentActions';
import { showSnackbar } from '../../redux/actions/snackbarActions';
import { loginEmail } from '../../redux/actions/authActions';
import getDayGreetingBr from '../../utils/getDayGreetingBr';
import PropTypes from 'prop-types';
import KeypadButton from '../modals/keypad';
import isThisApp from '../../utils/window/isThisApp';
import showVanillaToast from '../../components/vanilla-js/toastify/showVanillaToast';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 400,
  }
}));

function Login({ history }) {
    const [cpf, setData] = useState("0");

    const classes = useStyles();
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
            if(role === "colaborador") {
                setTimeout(() => showSnackbar(dispatch, "Redirecionando...", 'warning', 4000), 2900);
                setTimeout(() => history.push(`/colaborador/quadro-administrativo/${authUserId}`), 5000);
                setTimeout(() => showSnackbar(dispatch, msg, 'success', 9000), 7000);
            }
            if(role === "cliente") {
                if(isThisApp()) {
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
            backgroundColor="var(--themePDark)"
        />
    );

    const showKeypadButton = () => (
        <div className="animated jackInTheBox slow delay-1s d-flex justify-content-center my-4">
            <KeypadButton
                title="Informe o seu CPF"
                titleIcon="fas fa-list-ol"
                keyboardType="cpf"
                setSelectedValue={setData}
                confirmFunction={signInThisUser}
            />
        </div>
    );

    return (
        <div
            className='animated zoomIn fast container-center'
        >
            <Card className={classes.card}>
                {showTitle()}
                {showKeypadButton()}
                <div className="mx-2 mb-4 text-center">
                    <SafeEnvironmentMsg />
                </div>
            </Card>
        </div>
    );
}

export default withRouter(Login);


/* COMMENTS
n1: LESSON: autoComplete is "off" to not allow the browser to autocomplete with suggestions of other searches.other
Disablign this, can enhances security since it does not read past delicate infos.
*/