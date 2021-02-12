import React, { useState } from 'react';
import Title from '../../components/Title';
import RedirectPage from '../../components/RedirectPage';
import parse from 'html-react-parser';
// Redux
import { useStoreDispatch, useStoreState } from 'easy-peasy';
import { showSnackbar } from '../../redux/actions/snackbarActions'
import { sendNewPasswordLink } from '../../redux/actions/emailActions';
// helpers
import handleChange from '../../utils/form/use-state/handleChange';

// material-ui
import ButtonMulti from '../../components/buttons/material-ui/ButtonMulti';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import EmailIcon from '@material-ui/icons/Email';

export default function ChangePassword() {
    const [redirect, setRedirect] = useState(false);
    const [data, setData] = useState({
        email: '',
        needMsgAfterSent: false,
    })
    const { email, needMsgAfterSent } = data;

    // Redux
    const { bizInfo } = useStoreState(state => ({
        bizInfo: state.adminReducer.cases.businessInfo
    }))
    const { bizName, bizSlogon } = bizInfo;
    const dispatch = useStoreDispatch();
    // End Redux

    const showMsgAfterSent = needMsgAfterSent => {
        let redirect;
        if(needMsgAfterSent) {
            redirect = setTimeout(() => setRedirect(true), 15000);
        }
        return(
            needMsgAfterSent &&
            <div className="container-center" style={{'margin': '20px auto', 'width': '80%'}}>
                <p className="text-center text-normal animated zoomIn slow">
                    Pronto! Se não encontrar na sua caixa de entrada, verifique sua caixa de spam.
                    Se ainda não achar, clique em reenviar email abaixo:
                </p><br />
                <ButtonMulti
                    onClick={() => {
                        clearTimeout(redirect);
                        setData({needMsgAfterSent: false})
                    }}
                    variant='link'
                >
                    Reenviar Email
                </ButtonMulti>
                <div>
                    <p className="text-normal text-center">Você será redirecionado para página inicial em instantes.</p>
                </div>
            </div>
        );
    }

    // Email
    const sendEmail = () => {
        const bodyEmail = {
            email,
            bizName,
            bizSlogon
        }
        sendNewPasswordLink(dispatch, bodyEmail)
        .then(res => {
            if(res.status !== 200) return showSnackbar(dispatch, res.data.msg, 'error')
            showSnackbar(dispatch, res.data.msg, 'success', 5500);
            setTimeout(() => setData({needMsgAfterSent: true}), 6000);
        })

    };

    // Form
    const showButtonActions = () => (
        <div className="container-center my-4">
            <ButtonMulti
                onClick={sendEmail}
                iconFontAwesome="fas fa-paper-plane"
            >
                Enviar Email
            </ButtonMulti>
        </div>
    );

    const showForm = needMsgAfterSent => (
        !needMsgAfterSent &&
        <form className={!needMsgAfterSent ? "animated zoomIn" : null} style={{'margin': 'auto', 'width': '80%'}}>
            <TextField
                margin="dense"
                onChange={handleChange(setData, data)}
                name="email"
                type="email"
                label="Email"
                placeholder="Insira o email que você cadastrou"
                autoComplete="email"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
            />
            {showButtonActions()}
        </form>
    );
    return (
        <div>
            <Title title="Solicitar nova senha" subTitle={parse("Um link de troca de senha será enviado para o seu email cadastrado.<br />O link de recuperação estará disponível por 1 hora antes de expirar.")}/>
            <div>
                <img src="img/illustrations/empty-cart.png" width='100' height='100' alt="change-password"/>
            </div>
            {showForm(needMsgAfterSent)}
            {showMsgAfterSent(needMsgAfterSent)}
            <RedirectPage to="/" activated={redirect} />
        </div>
    );
}
