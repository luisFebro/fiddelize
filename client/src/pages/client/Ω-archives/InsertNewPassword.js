import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import Title from '../../components/Title';
// Redux
import { useStoreDispatch } from 'easy-peasy';
import { changePassword } from '../../redux/actions/authActions';
import { showSnackbar } from '../../redux/actions/snackbarActions'
import { showModalLogin } from '../../redux/actions/modalActions';
// helpers
import handleChange from '../../utils/form/use-state/handleChange';
import getFirstQueryValue from '../../utils/string/getFirstQueryValue';

// material-ui
import ToggleVisibilityPassword from '../../components/forms/fields/ToggleVisibilityPassword';
import ButtonMulti from '../../components/buttons/material-ui/ButtonMulti';

export default function InsertNewPassword({ location, match }) {
    const [data, setData] = useState({
        password: '',
        needRedirectToLogin: false,
        userId: getFirstQueryValue(location.search),
        authToken: match.params.token,
    })
    const { password, needRedirectToLogin, userId, authToken } = data;

    // Redux
    const dispatch = useStoreDispatch();
    // End Redux

    const redirectToLogin = needRedirectToLogin => (
        needRedirectToLogin &&
        <Redirect to="/" />
    );

    // password
    const handlePassword = () => {
        const bodyPass = {
            password,
            authToken
        }
        changePassword(dispatch, bodyPass, userId)
        .then(res => {
            if(res.status !== 200) return showSnackbar(dispatch, res.data.msg, 'error');
            showSnackbar(dispatch, res.data.msg, 'success');
            setData({needRedirectToLogin: true})
            setTimeout(() => showModalLogin(dispatch), 2000);
            setTimeout(() => showSnackbar(dispatch, "Faça o seu login com sua nova senha", 7000), 5000);
        })
    };

    // Form
    const showButtonActions = () => (
        <div className="container-center my-4">
            <ButtonMulti
                onClick={handlePassword}
                iconFontAwesome="fas fa-password"
            >
                Trocar Senha
            </ButtonMulti>
        </div>
    );

    const showForm = needRedirectToLogin => (
        !needRedirectToLogin &&
        <form className={!needRedirectToLogin ? "animated zoomIn" : null} style={{'margin': 'auto', 'width': '80%'}}>
            <ToggleVisibilityPassword
                data={data}
                setData={setData}
                onChange={handleChange(setData, data)}
                error={null}
                label="Nova Senha aqui."
                showForgotPass={false}
            />
            {showButtonActions()}
        </form>
    );
    return (
        <div>
            <Title title="Insira sua nova senha"/>
            {showForm(needRedirectToLogin)}
            {redirectToLogin(needRedirectToLogin)}
        </div>
    );
}
