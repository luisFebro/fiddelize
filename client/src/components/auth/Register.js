import React, { useEffect, useState } from 'react';
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import Title from '../Title';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import phoneMaskBr from '../../utils/validation/masks/phoneMaskBr';
import cpfMaskBr from '../../utils/validation/masks/cpfMaskBr';
import getDayMonthBr from '../../utils/dates/getDayMonthBr';
import SafeEnvironmentMsg from '../SafeEnvironmentMsg';
// import ReCaptchaCheckbox from "../ReCaptcha";
// Redux
import { useStoreState, useStoreDispatch } from 'easy-peasy';
import { showSnackbar } from '../../redux/actions/snackbarActions';
import { registerEmail } from '../../redux/actions/authActions';
import { sendWelcomeConfirmEmail } from '../../redux/actions/emailActions';
// Helpers
import detectErrorField from '../../utils/validation/detectErrorField';
import handleChange from '../../utils/form/use-state/handleChange';
// Material UI
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import EmailIcon from '@material-ui/icons/Email';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoneyIcon from '@material-ui/icons/Money';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import CakeIcon from '@material-ui/icons/Cake';
import Card from '@material-ui/core/Card';
import ButtonMulti from '../buttons/material-ui/ButtonMulti';

// moment.locale = "pt-br";

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 345,
        filter: 'drop-shadow(.001em .001em .15em var(--mainDark))',
    }
}));

function Register() {
    const [selectedDate, handleDateChange] = useState(new Date());
    const [data, setData] = useState({
        name: '',
        email: '',
        phone: '',
        birthday: '',
        cpf: '',
        maritalStatus: 'selecione estado civil',
    });
    const { name, email, maritalStatus, birthday, cpf, phone } = data;

    const { bizInfo } = useStoreState(state => ({
        bizInfo: state.adminReducer.cases.businessInfo,
    }));

    const { bizName, bizWebsite, bizInstagram } = bizInfo;

    // detecting field errors
    const [fieldError, setFieldError] = useState(null);
    const errorName = fieldError && fieldError.name;
    const errorEmail = fieldError && fieldError.email;
    const errorMaritalStatus = fieldError && fieldError.maritalStatus;
    const errorBirthday = fieldError && fieldError.birthday;
    const errorCpf = fieldError && fieldError.cpf;
    const errorPhone = fieldError && fieldError.phone;
    // end detecting field errors

    const dispatch = useStoreDispatch();

    const classes = useStyles();

    useEffect(() => {
        setData({ ...data, birthday: getDayMonthBr(selectedDate) })
    }, [selectedDate])

    const clearData = () => {
        setData({
            name: '',
            email: '',
            phone: '',
            birthday: '',
            cpf: '',
            maritalStatus: 'selecione estado civil'
        })
        setFieldError(null);
    }

    const sendEmail = userId => {
        const dataEmail = {
            name,
            email,
            bizName,
            bizWebsite,
            bizInstagram
        };
        sendWelcomeConfirmEmail(dataEmail, userId)
        .then(res => {
            if (res.status !== 200) return showSnackbar(dispatch, res.data.msg, 'error');
            // Dont show email toast =>> setTimeout(() => showSnackbar(dispatch, res.data.msg, 'warning', 3000), 4000);
        });
    };

    const registerThisUser = e => {
        const newUser = {
            name,
            email,
            maritalStatus,
            birthday,
            cpf,
            phone
        };

        registerEmail(dispatch, newUser)
            .then(res => {
                if(res.status !== 200) {
                    showSnackbar(dispatch, res.data.msg, 'error', 6000);
                    // detect field errors
                    const thisModalFields = Object.keys(data);
                    const foundObjError = detectErrorField(res.data.msg, thisModalFields);
                    setFieldError(foundObjError);
                    return;
                }
                sendEmail(res.data.authUserId);
                clearData();

                showSnackbar(dispatch, 'Registrando...')
                // window.location.href reloads the page to trigger PWA beforeInstall. history.push does not reload the target page...
                setTimeout(() => window.location.href = `/baixe-app/${name}?isFromRegister=true`, 3000);
            })

    };

    const showTitle = () => (
        <Title
            title="Cadastre-se"
            subTitle="É rápido e fácil"
            color="var(--mainWhite)"
            backgroundColor="var(--themePDark)"
        />
    );

    const showForm = () => (
        <form
            style={{margin: 'auto', width: '80%'}}
            onBlur={() => setFieldError(null)}
        >
            <TextField
                required
                margin="dense"
                onChange={handleChange(setData, data)}
                error={errorCpf ? true : false}
                name="cpf"
                onBlur={() => setData({ ...data, cpf: cpfMaskBr(cpf)})}
                value={cpf}
                type="text"
                label="Insira seu CPF"
                autoComplete="off"
                helperText="Digite apenas números."
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon />
                    </InputAdornment>
                  ),
                }}
            />
            <TextField
                required
                onChange={handleChange(setData, data)}
                error={errorName ? true : false}
                margin="dense"
                id="name"
                name="name"
                autoComplete="off"
                value={name}
                type="name"
                label="Qual é o seu nome e sobrenome?"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
            />
            <MuiPickersUtilsProvider utils={MomentUtils} locale={"pt-br"}> {/*TODO: Do a component for pickers*/}
                <DatePicker
                    required
                    variant="inline"
                    margin="dense"
                    error={errorBirthday ? true : false}
                    openTo="month"
                    autoOk={true}
                    placeholder="Dia e Mês"
                    views={["month", "date"]}
                    label="Quando é o seu aniversário?"
                    name="birthday"
                    value={selectedDate}
                    onChange={handleDateChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CakeIcon />
                        </InputAdornment>
                      ),
                    }}
                />
            </MuiPickersUtilsProvider>
            <TextField
                required
                margin="dense"
                onChange={handleChange(setData, data)}
                error={errorEmail ? true : false}
                name="email"
                value={email}
                type="email"
                label="Email"
                autoComplete="off"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
            />
            <TextField
                required
                margin="dense"
                onChange={handleChange(setData, data)}
                error={errorPhone ? true : false}
                onBlur={() => setData({ ...data, phone: phoneMaskBr(phone)})}
                name="phone"
                helperText={"Digite apenas números com DDD"}
                value={phone}
                type="tel"
                label="Contato"
                autoComplete="off"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIphoneIcon />
                    </InputAdornment>
                  ),
                }}
            />
            <Select
              style={{ margin: '9px 0' }}
              labelId="maritalStatus"
              onChange={handleChange(setData, data)}
              name="maritalStatus"
              value={maritalStatus}
              error={errorMaritalStatus ? true : false}
            >
              <MenuItem value={maritalStatus}>
                selecione estado civil:
              </MenuItem>
              <MenuItem value={"Solteiro(a)"}>Solteiro(a)</MenuItem>
              <MenuItem value={"Casado(a)"}>Casado(a)</MenuItem>
              <MenuItem value={"Divorciado(a)"}>Divorciado(a)</MenuItem>
              <MenuItem value={"Viúvo(a)"}>Viúvo(a)</MenuItem>
            </Select>
            <SafeEnvironmentMsg />
        </form>
    );

    // const showReCaptcha = () => (
    //     <div className="container-center mt-3">
    //         <ReCaptchaCheckbox setToken={setData} data={data} />
    //     </div>
    // );

    const showButtonActions = () => (
        <div className="container-center">
            <ButtonMulti
                onClick={() => {
                    registerThisUser();
                }}
                color="var(--mainDark)"
                textShadow="none"
                backgroundColor="var(--themeSDark)"
                backColorOnHover="var(--themeSDark)"
                iconFontAwesome="fas fa-save"
                textTransform='uppercase'
            >
                Registrar
            </ButtonMulti>
        </div>
    );

    return (
        <div
            className="animated zoomIn fast m-5 svg-elevation"
        >
            <Card
                style={{maxWidth: 465, boxShadow: '0 31px 120px -6px rgba(0, 0, 0, 0.35)'}}
            >
                {showTitle()}
                {showForm()}
                {showButtonActions()}
            </Card>
        </div>
    );
}

export default React.memo(Register);
/*
<div style={{whiteSpace: 'wrap'}}>
    {JSON.stringify(data)}
</div>
 */

/*
MODEL BTN PINK CIRCULAR
<button
    style={{
        color: "white",
        padding: '2px 5px',
        borderRadius: '20px',
        backgroundColor: 'var(--mainPink)',
        outline: "none"
    }}
    onClick={changeToLogin}
>
</button>
 */