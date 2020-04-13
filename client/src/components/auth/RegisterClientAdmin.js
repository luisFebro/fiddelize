import React, { Fragment,useEffect, useState } from 'react';
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import Title from '../Title';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import phoneMaskBr from '../../utils/validation/masks/phoneMaskBr';
import cpfMaskBr from '../../utils/validation/masks/cpfMaskBr';
import getDayMonthBr from '../../utils/dates/getDayMonthBr';
import SafeEnvironmentMsg from '../SafeEnvironmentMsg';
import RadiusBtn from '../../components/buttons/RadiusBtn';
// import { withRouter } from 'react-router-dom';
// import ReCaptchaCheckbox from "../ReCaptcha";
// Redux
import { useStoreState, useStoreDispatch } from 'easy-peasy';
import { showSnackbar } from '../../redux/actions/snackbarActions';
import { registerEmail } from '../../redux/actions/authActions';
import { sendWelcomeConfirmEmail } from '../../redux/actions/emailActions';
// Helpers
import detectErrorField from '../../utils/validation/detectErrorField';
import handleChange from '../../utils/form/use-state/handleChange';
import { handleFocus } from '../../utils/form';
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
import setValObjWithStr from '../../utils/objects/setValObjWithStr';
import { getUniqueCodeName } from '../../utils/string/generateAlphaNumeric';
import addDashesToString from '../../utils/string/addDashesToString';
import 'moment/locale/pt-br';
moment.updateLocale('pt-BR');
const isSmall = window.Helper.isSmallScreen();

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 345,
        filter: 'drop-shadow(.001em .001em .15em var(--mainDark))',
    }
}));

function RegisterClientAdmin({ setLoginOrRegister, needLoginBtn }) {
    const [selectedDate, handleDateChange] = useState(new Date());
    const [showThisField, setShowThisField] = useState(false);
    const [switchNumToText, setSwitchNumToText] = useState(false); //n1
    const [data, setData] = useState({
        role: 'cliente-admin',
        name: '',
        clientAdminData: { bizName: '', bizCodeName: ''},
        email: '',
        phone: '',
        birthday: '',
        cpf: '',
        maritalStatus: 'selecione estado civil',
    });
    let { role, name, clientAdminData, email, maritalStatus, birthday, cpf, phone } = data;

    const { bizInfo } = useStoreState(state => ({
        bizInfo: state.adminReducer.cases.businessInfo,
    }));

    const { bizName, bizWebsite, bizInstagram } = bizInfo;

    // detecting field errors
    const [fieldError, setFieldError] = useState(null);
    const errorName = fieldError && fieldError.name;
    const errorBizName = fieldError && fieldError.name;
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

    useEffect(() => {
        if(clientAdminData.bizName) {
            const bizCode = getUniqueCodeName(clientAdminData.bizName);
            const finalDashedName = addDashesToString(`${clientAdminData.bizName} ${bizCode}`)
            setValObjWithStr(data, "clientAdminData.bizCodeName", finalDashedName);
        }
    }, [clientAdminData.bizName])

    const clearData = () => {
        setData({
            role: 'cliente-admin',
            name: '',
            email: '',
            phone: '',
            birthday: '',
            cpf: '',
            maritalStatus: 'selecione estado civil',
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
            ...data,
            "clientAdminData.bizWhatsapp": phone,
        };

        showSnackbar(dispatch, 'Registrando... Aguarde um momento.', 'warning', 7000)
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

            const removalOptions = {
                collection: "onceChecked",
            }
            lStorage("removeItems", removalOptions);

            // window.location.href reloads the page to trigger PWA beforeInstall. history.push does not reload the target page...
            setTimeout(() => window.location.href = `/${clientAdminData.bizCodeName}/novo-app?id=${res.data.authUserId}&bizName=${clientAdminData.bizName}&name=${name}`, 500);

            sendEmail(res.data.authUserId);

        })
    };

    const handleShowCurrField = field => {
        const field2 =  showThisField === "field2" && name.length >= 1 || showThisField === "field3" || showThisField === "field4" || showThisField === "otherFields";
        const field3 = showThisField === "field3" && clientAdminData.bizName.length >= 1 || showThisField === "field4" || showThisField === "otherFields";
        const field4 = showThisField === "field4" && cpf.length >= 1 || showThisField === "otherFields";

        switch(field) {
            case "field2":
                return field2;
            case "field3":
                return field3;
            case "field4":
                return field4;
            case "otherFields":
                return showThisField === "otherFields";
            default:
                console.log("something went wrong with handleShowCurrField...")
        }
    }

    const showLoginForm = needLoginBtn => (
        needLoginBtn && (
            <div
                className="text-white position-absolute text-small font-weight-bold p-2"
                style={{top: isSmall ? '105px' : '130px', left: '50px'}}
            >
                <p style={{whiteSpace: 'nowrap'}}>Já é cadastrado?{" "}
                <RadiusBtn title="Faça login" onClick={() => setLoginOrRegister("login")} /></p>
            </div>
        )
    );

    const showTitle = () => (
        <div className="position-relative">
            <Title
                title="Comece Hoje!"
                subTitle="Cadastre-se aqui."
                color="var(--mainWhite)"
                backgroundColor="var(--themePDark)"
            />
            {showLoginForm(needLoginBtn)}
        </div>
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
        },
        card: {
            margin: 'auto',
            width: '90%',
            maxWidth: isSmall ? "" : 360,
            boxShadow: '0 31px 120px -6px rgba(0, 0, 0, 0.35)'
        }
    }

    const showForm = () => (
        <form
            style={{margin: 'auto', width: '90%'}}
            className="text-p text-normal"
            onBlur={() => setFieldError(null)}
        >
            <div className="mt-3">
                Empreendedor(a),<br />qual é o seu nome?
                <TextField
                    required
                    onChange={handleChange(setData, data)}
                    error={errorName ? true : false}
                    variant="outlined"
                    margin="dense"
                    id="field1"
                    name="name"
                    value={name}
                    onKeyPress={e => {
                        if(isKeyPressed(e, "Enter")) {setShowThisField("field2", 1500); setData({ ...data, name: name.cap()}); handleFocus("field2");}
                    }}
                    onBlur={() => {
                        setShowThisField("field2", 1500);
                        handleFocus("field2");
                        setData({ ...data, name: name.cap()})
                    }}
                    autoComplete="off"
                    type="text"
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
            <div className={`animated slideInDown fast mt-3 ${handleShowCurrField("field2") ? "d-block" : "d-none"}`}>
                Qual é o nome do<br />seu projeto/empresa?
                <TextField
                    id="field2"
                    required
                    onChange={handleChange(setData, data, true)}
                    error={errorBizName ? true : false}
                    variant="outlined"
                    margin="dense"
                    name="clientAdminData.bizName"
                    value={clientAdminData.bizName}
                    onKeyPress={e => {
                        if(isKeyPressed(e, "Enter")) {setShowThisField("field3", 1500); setValObjWithStr(data, "clientAdminData.bizName", clientAdminData.bizName.cap()); handleFocus("field3");}
                    }}
                    onBlur={() => {
                        setShowThisField("field3", 1500);
                        handleFocus("field3");
                        setData({ ...data, name: name.cap()})
                    }}
                    autoComplete="off"
                    type="text"
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
            <div className={`animated slideInDown fast mt-3 ${handleShowCurrField("field3") ? "d-block" : "d-none"}`}>
                Ok, informe seu CPF
                <TextField
                    id="field3"
                    required
                    margin="dense"
                    onChange={handleChange(setData, data)}
                    error={errorCpf ? true : false}
                    name="cpf"
                    variant="outlined"
                    autoOk={false}
                    onKeyPress={e => {
                        if(isKeyPressed(e, "Enter")) { setShowThisField("field4"); handleFocus("field4", 800); setData({ ...data, cpf: cpfMaskBr(cpf)}); setSwitchNumToText(true); }
                    }}
                    onBlur={() => { setShowThisField("field4"); handleFocus("field4", 800); setData({ ...data, cpf: cpfMaskBr(cpf)}); setSwitchNumToText(true); }}
                    value={cpf}
                    type={switchNumToText ? "text": "tel"}
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
            <div className={`animated slideInDown fast mt-3 ${handleShowCurrField("field4") ? "d-block" : "d-none"}`}>
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
                        onChange={e => {
                            handleDateChange(e._d)
                            handleFocus("field5", 1500)
                            setShowThisField("otherFields")
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CakeIcon />
                            </InputAdornment>
                          ),
                          style: styles.fieldForm,
                          id: "field4"
                        }}
                    />
                </MuiPickersUtilsProvider>
            </div>
            <section className={`animated slideInLeft fast ${handleShowCurrField("otherFields")  ? "d-block" : "d-none"}`}>
                <p className="text-left my-2">Para finalizar seu cadastro...</p>
                <div className="mt-3">
                    Email
                    <TextField
                        id="field5"
                        required
                        margin="dense"
                        onChange={handleChange(setData, data)}
                        onKeyPress={e => isKeyPressed(e, "Enter") && handleFocus("field6")}
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
                    Contato/Whatsapp
                    <TextField
                        required
                        id="field6"
                        margin="dense"
                        onChange={handleChange(setData, data)}
                        error={errorPhone ? true : false}
                        onBlur={() => setData({ ...data, phone: phoneMaskBr(phone)})}
                        onKeyPress={e => isKeyPressed(e, "Enter") && setData({ ...data, phone: phoneMaskBr(phone)}) && handleFocus("field7")}
                        name="phone"
                        value={phone}
                        helperText={"Digite apenas números com DDD"}
                        FormHelperTextProps={{ style: styles.helperFromField }}
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
                      id="field7"
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
            className="animated zoomIn fast card-elevation mb-5"
            style={styles.card}
        >
            {showTitle()}
            {showForm()}
            {showButtonActions()}
        </Card>
    );
}

export default React.memo(RegisterClientAdmin);

/* ARCHIVES
<div style={{whiteSpace: 'wrap'}}>
    {JSON.stringify(data)}
</div>

handleFocus()
while (next = next.nextElementSibling) {
            console.log(next.tagName.toLowerCase());
            if(next === null){ break; }
            if(next.tagName.toLowerCase() === "fieldset") {
                console.log('next', next.children[0])
                break;
            }
        }

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

/* COMMENTS
n1: used here because it disappears if string or decimal...
*/