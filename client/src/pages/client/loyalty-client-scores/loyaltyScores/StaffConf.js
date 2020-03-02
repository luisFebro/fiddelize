import React, { useState } from 'react';
import Title from '../../../../components/Title';
import { useStoreDispatch } from 'easy-peasy';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import MoneyIcon from '@material-ui/icons/Money';
import Card from '@material-ui/core/Card';
import { showComponent } from '../../../../redux/actions/componentActions';
import { showSnackbar } from '../../../../redux/actions/snackbarActions';
import ButtonMulti from '../../../../components/buttons/material-ui/ButtonMulti';
import handleChange from '../../../../utils/form/use-state/handleChange';
import detectErrorField from '../../../../utils/validation/detectErrorField';
import { handleEnterPress } from '../../../../utils/event/isKeyPressed';
import clearForm from '../../../../utils/form/use-state/clearForm';
import { checkVerificationPass } from "../../../../redux/actions/adminActions";
import PropTypes from 'prop-types';
import showVanillaToast from '../../../../components/vanilla-js/toastify/showVanillaToast';

StaffConf.propTypes = {
    success: PropTypes.bool,
    setVerification: PropTypes.func,
}

export default function StaffConf({ success, setVerification }) {
    const [data, setData] = useState({
        pass: '',
    })

    const { pass } = data;
    const [fieldError, setFieldError] = useState(null);
    const errorCpf = fieldError && fieldError.cpf;

    const dispatch = useStoreDispatch();

    const clearData = () => {
        clearForm(setData, data);
        setFieldError(null);
    }

    const checkAccess = () => {
        const bodyToSend = {
            pass
        }
        checkVerificationPass(dispatch, bodyToSend)
        .then(res => {
            if(res.status !== 200) {
                showSnackbar(dispatch, res.data.msg, 'error');
                showVanillaToast("A senha de verificação está errada.", 5000, { backgroundColor: 'var(--mainRed)'})
                return;
            }
            showSnackbar(dispatch, res.data.msg, 'success');
            setVerification(true);
            showComponent(dispatch, 'clientScoresPanel')
        })
    };

    const showTitle = () => (
        <Title
            title="Insira a senha de verificação"
            color="var(--mainWhite)"
            backgroundColor="var(--themePDark)"
        />
    );

    const showForm = () => (
        <form
            style={{margin: 'auto', width: '80%', backgroundColor: "white"}}
            onBlur={() => setFieldError(null)}
        >
            <TextField
                required
                variant="standard"
                margin="dense"
                onChange={handleChange(setData, data)}
                autoComplete="off"
                onKeyPress={e => handleEnterPress(e, checkAccess)}
                error={null}
                name="pass"
                value={pass}
                type="text"
                className="dot-font"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon />
                    </InputAdornment>
                  ),
                  style: {
                    backgroundColor: 'white',
                  }
                }}
            />
        </form>
    );

    const showButtonActions = () => (
        <div className="container-center mt-1 mb-4">
            <ButtonMulti
                onClick={checkAccess}
                color="var(--mainWhite)"
                backgroundColor="var(--themeSDark)"
                backColorOnHover="var(--themeSDark)"
                iconFontAwesome="fas fa-check"
                textTransform='uppercase'
            >
                Verificar
            </ButtonMulti>
        </div>
    );

    return (
        <div
            className='animated slideInLeft fast container-center mt-5'
        >
            <Card
                className="text-normal align-self-center"
                style={{ maxWidth: 330, backgroundColor: 'var(--themePDark)' }}
            >
                {showTitle()}
                {showForm()}
                {showButtonActions()}
            </Card>
        </div>
    );
}