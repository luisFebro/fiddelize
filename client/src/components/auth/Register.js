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
import lStorage from '../../utils/storage/lStorage';
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
import isKeyPressed from '../../utils/event/isKeyPressed';
import moment from 'moment';
import 'moment/locale/pt-br';
moment.updateLocale('pt-BR');

const isSmall = window.Helper.isSmallScreen();

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 345,
        filter: 'drop-shadow(.001em .001em .15em var(--mainDark))',
    }
}));

function Register() {
    const [selectedDate, handleDateChange] = useState(new Date());
    const [showMoreFields, setShowMoreFields] = useState(false);
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
            clearData();
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

                showSnackbar(dispatch, 'Registrando...')
                // window.location.href reloads the page to trigger PWA beforeInstall. history.push does not reload the target page...
                setTimeout(() => window.location.href = `/baixe-app/${name}?isFromRegister=true`, 3000);

                const removalOptions = {
                    collection: "onceChecked",
                }
                lStorage("removeItems", removalOptions);
            })

    };

    const handleShowFields = field => {
        const field2 =  showMoreFields === "field2" && name.length >= 1 || showMoreFields === "field3" || showMoreFields === "otherFields";
        const field3 = showMoreFields === "field3" && cpf.length >= 1 || showMoreFields === "otherFields";

        switch(field) {
            case "field2":
                return field2;
            case "field3":
                return field3;
            case "otherFields":
                return showMoreFields === "otherFields";
            default:
                console.log("something went wrong with handleShowFields...")
        }
    }

    const showTitle = () => (
        <Title
            title="Comece Hoje!"
            subTitle="Cadastre-se aqui."
            color="var(--mainWhite)"
            backgroundColor="var(--themePDark)"
        />
    );

    const styles = {
        fieldForm: {
            backgroundColor: 'var(--mainWhite)',
            zIndex: 2000,
            font: 'normal 1em Poppins, sans-serif',
        },
        helperFromField: {
            color: 'grey',
            fontFamily: 'Poppins, sans-serif',
            fontSize: isSmall ? '.8em' : '.6em',
        }
    }

    const showForm = () => (
        <form
            style={{margin: 'auto', width: '90%'}}
            className="text-p text-normal"
            onBlur={() => setFieldError(null)}
        >
            <div className="mt-3">
                Qual é o seu nome?
                <TextField
                    required
                    onChange={handleChange(setData, data)}
                    error={errorName ? true : false}
                    variant="outlined"
                    margin="dense"
                    id="name"
                    name="name"
                    onKeyPress={e => {
                        if(isKeyPressed(e, "Enter")) {setShowMoreFields("field2"); setData({ ...data, name: name.cap()});}
                    }}
                    onBlur={() => {
                        setShowMoreFields("field2");
                        setData({ ...data, name: name.cap()})
                    }}
                    autoComplete="off"
                    value={name}
                    type="name"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircle />
                        </InputAdornment>
                      ),
                      style: styles.fieldForm
                    }}
                />
            </div>
            <div className={`animated slideInDown fast mt-3 ${handleShowFields("field2") ? "d-block" : "d-none"}`}>
                Ok, informe seu CPF
                <TextField
                    required
                    margin="dense"
                    onChange={handleChange(setData, data)}
                    error={errorCpf ? true : false}
                    name="cpf"
                    variant="outlined"
                    autoOk={false}
                    onKeyPress={e => {
                        if(isKeyPressed(e, "Enter")) {setShowMoreFields("field3"); setData({ ...data, cpf: cpfMaskBr(cpf)});}
                    }}
                    onBlur={() => {
                        setShowMoreFields("field3");
                        setData({ ...data, cpf: cpfMaskBr(cpf)})
                    }}
                    value={cpf}
                    type="text"
                    autoComplete="off"
                    helperText="Digite apenas números."
                    FormHelperTextProps={{ style: styles.helperFromField }}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MoneyIcon />
                        </InputAdornment>
                      ),
                      style: styles.fieldForm
                    }}
                />
            </div>
            <div className={`animated slideInDown fast mt-3 ${handleShowFields("field3") ? "d-block" : "d-none"}`}>
                {name
                ? <span>{name.cap()}, quando é o seu aniversário?</span>
                : <span>Quando é o seu aniversário?</span>}
                <MuiPickersUtilsProvider
                    utils={MomentUtils}
                    locale={"pt-br"}
                >
                    <DatePicker
                        required
                        inputVariant="outlined"
                        margin="dense"
                        error={errorBirthday ? true : false}
                        openTo="month"
                        autoOk={false}
                        placeholder="Dia e Mês"
                        views={["month", "date"]}
                        name="birthday"
                        value={selectedDate}
                        onChange={() => {
                            handleDateChange()
                            setShowMoreFields("otherFields")
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CakeIcon />
                            </InputAdornment>
                          ),
                          style: styles.fieldForm,
                        }}
                    />
                </MuiPickersUtilsProvider>
            </div>
            <section className={`animated slideInLeft fast ${handleShowFields("otherFields")  ? "d-block" : "d-none"}`}>
                <div className="mt-3">
                    Email
                    <TextField
                        required
                        margin="dense"
                        onChange={handleChange(setData, data)}
                        error={errorEmail ? true : false}
                        name="email"
                        variant="outlined"
                        value={email}
                        type="email"
                        autoComplete="off"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon />
                            </InputAdornment>
                          ),
                          style: styles.fieldForm
                        }}
                    />
                </div>
                <div className="mt-3">
                    Contato
                    <TextField
                        required
                        margin="dense"
                        onChange={handleChange(setData, data)}
                        error={errorPhone ? true : false}
                        onBlur={() => setData({ ...data, phone: phoneMaskBr(phone)})}
                        onKeyPress={e => isKeyPressed(e, "Enter") && setData({ ...data, phone: phoneMaskBr(phone)})}
                        name="phone"
                        helperText={"Digite apenas números com DDD"}
                        FormHelperTextProps={{ style: styles.helperFromField }}
                        value={phone}
                        type="tel"
                        autoComplete="off"
                        fullWidth
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIphoneIcon />
                            </InputAdornment>
                          ),
                          style: styles.fieldForm
                        }}
                    />
                </div>
                <div className="my-3">
                    <Select
                      margin="dense"
                      labelId="maritalStatus"
                      onChange={handleChange(setData, data)}
                      name="maritalStatus"
                      fullWidth
                      value={maritalStatus}
                      variant="outlined"
                      error={errorMaritalStatus ? true : false}
                      style={{backgroundColor: 'var(--mainWhite)'}}
                    >
                      <MenuItem value={maritalStatus}>
                        <span className="text-p text-normal" style={{fontSize: isSmall ? '1.1em' : "", fontFamily: 'Poppins, sans-serif'}}>selecione estado civil:</span>
                      </MenuItem>
                      <MenuItem value={"Solteiro(a)"}>Solteiro(a)</MenuItem>
                      <MenuItem value={"Casado(a)"}>Casado(a)</MenuItem>
                      <MenuItem value={"Divorciado(a)"}>Divorciado(a)</MenuItem>
                      <MenuItem value={"Viúvo(a)"}>Viúvo(a)</MenuItem>
                    </Select>
                </div>
            </section>
            <SafeEnvironmentMsg />
        </form>
    );

    const showButtonActions = () => (
        <div className="container-center">
            <ButtonMulti
                onClick={() => {
                    registerThisUser();
                }}
                color="var(--mainWhite)"
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
        <Card
            className="animated zoomIn fast card-elevation"
            style={{margin: 'auto', width: '90%',  maxWidth: isSmall ? "" : 465, boxShadow: '0 31px 120px -6px rgba(0, 0, 0, 0.35)'}}
        >
            {showTitle()}
            {showForm()}
            {showButtonActions()}
        </Card>
    );
}

export default React.memo(Register);

/* ARCHIVES
<div style={{whiteSpace: 'wrap'}}>
    {JSON.stringify(data)}
</div>

const showReCaptcha = () => (
    <div className="container-center mt-3">
        <ReCaptchaCheckbox setToken={setData} data={data} />
    </div>
);
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