import React, { Fragment,useEffect, useState } from 'react';
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import Title from '../Title';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import phoneMaskBr from '../../utils/validation/masks/phoneMaskBr';
import cpfMaskBr from '../../utils/validation/masks/cpfMaskBr';
import getDayMonthBr from '../../utils/dates/getDayMonthBr';
import SafeEnvironmentMsg from '../SafeEnvironmentMsg';
import RadiusBtn from '../../components/buttons/RadiusBtn';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import ReCaptchaCheckbox from "../ReCaptcha";
// Redux
import { useStoreState, useStoreDispatch } from 'easy-peasy';
import { showSnackbar } from '../../redux/actions/snackbarActions';
import { registerEmail } from '../../redux/actions/authActions';
import { countField } from '../../redux/actions/userActions';
// import { sendWelcomeConfirmEmail } from '../../redux/actions/emailActions';
// Helpers
import detectErrorField from '../../utils/validation/detectErrorField';
import handleChange from '../../utils/form/use-state/handleChange';
import lStorage from '../../utils/storage/lStorage';
import { useClientAdmin } from '../../hooks/useRoleData';
import selectTxtStyle from '../../utils/biz/selectTxtStyle';
// Material UI
// import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import EmailIcon from '@material-ui/icons/Email';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoneyIcon from '@material-ui/icons/Money';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import CakeIcon from '@material-ui/icons/Cake';
import Card from '@material-ui/core/Card';
import ButtonMulti, {faStyle} from '../buttons/material-ui/ButtonMulti';
import isKeyPressed from '../../utils/event/isKeyPressed';
import { dateFnsUtils, ptBRLocale } from '../../utils/dates/dateFns';
import ReactGA from 'react-ga';
import { handleFocus } from '../../utils/form/handleFocus';

// bizSysId for validation only since when the user is runningthe app
// for the first time, businessId returns "0"...
const collection = { collection: "appSystem" };
const appSystem = lStorage("getItems", collection);
const bizSysId = appSystem && appSystem.businessId;

const isSmall = window.Helper.isSmallScreen();

function Register({ setLoginOrRegister, needLoginBtn = false }) {
    const [actionBtnDisabled, setActionBtnDisabled] = useState(false);
    const [showMoreFields, setShowMoreFields] = useState(false);
    const [switchNumToText, setSwitchNumToText] = useState(false); //n1
    const [data, setData] = useState({
        role: 'cliente',
        name: '',
        email: '',
        phone: '',
        birthday: '',
        cpf: '',
        maritalStatus: 'selecione estado civil',
        clientUserData: { bizId: bizSysId },
    });

    const dateNow = new Date();
    const maxYear = dateNow.getFullYear() - 18;
    dateNow.setFullYear(maxYear);
    const [selectedDate, handleDateChange] = useState(dateNow);

    let { role, name, email, maritalStatus, birthday, cpf, phone } = data;

    const { selfThemePColor, selfThemeSColor, selfThemeBackColor } = useClientAdmin();
    // const { bizInfo } = useStoreState(state => ({
    //     bizInfo: state.adminReducer.cases.businessInfo,
    // }));

    // const { bizName, bizWebsite, bizInstagram } = bizInfo;

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

    useEffect(() => {
        const opts = { needYear: true }
        setData({ ...data, birthday: getDayMonthBr(selectedDate, opts) })
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

    // Temporarily disabled (Not sending emails)
    // const sendEmail = userId => {
    //     const dataEmail = {
    //         name,
    //         email,
    //         bizName,
    //         bizWebsite,
    //         bizInstagram
    //     };
    //     sendWelcomeConfirmEmail(dataEmail, userId)
    //     .then(res => {
    //         if (res.status !== 200) return showSnackbar(dispatch, res.data.msg, 'error');
    //         // Dont show email toast =>> setTimeout(() => showSnackbar(dispatch, res.data.msg, 'warning', 3000), 4000);
    //         clearData();
    //     });
    // };

    const registerThisUser = e => {
        setActionBtnDisabled(true);
        if(!bizSysId || bizSysId === "0") return showSnackbar(dispatch, "Nenhuma chave de acesso encontrada. Faça login se for admin ou desinstale e baixe o app novamente.", "warning", 7000)

        const newUser = {
            ...data,
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

            ReactGA.event({
                category: 'UserCliUser',
                action: 'Created an account',
                label: 'form',
                nonInteraction: true,
                transport: 'beacon',
            });

            lStorage("removeCol", {collection: 'onceChecked'})

            const objToSend = { field: "clientAdminData.totalClientUsers", type: 'inc' }
            countField(bizSysId, objToSend)
            .then(res => {
                if(res.status !== 200) return showSnackbar(dispatch, res.data.msg, 'error')
                setLoginOrRegister("login");
                showSnackbar(dispatch, `${name}, seu cadastro foi realizado com sucesso. Faça seu acesso.`, "success", 9000)
                // sendEmail(res.data.authUserId);
            })
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

    const showLoginForm = needLoginBtn => (
        needLoginBtn && (
            <div
                class="container-center animated zoomIn delay-2s position-relative p-2 mt-3"
            >
                <p
                    className={`${selectTxtStyle(selfThemeBackColor)} m-0 font-weight-bold text-small`}
                    style={{whiteSpace: 'nowrap'}}
                >
                    Já é cadastrado(a)?{"  "}
                </p>
                <div className="pl-2">
                    <RadiusBtn
                        size="small"
                        title="Faça login"
                        onClick={() => setLoginOrRegister("login")}
                        backgroundColor={"var(--themeSDark--" +  selfThemeSColor + ")"}
                    />
                </div>
            </div>
        )
    );

    const showTitle = () => (
        <div className="position-relative">
            <Title
                title="Cadastre-se!"
                subTitle="É rápido e fácil."
                color="var(--mainWhite)"
                needShadow={true}
                backgroundColor={"var(--themePDark--" +  selfThemePColor + ")"}
            />
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
        }
    }

    const showForm = () => (
        <form
            style={{margin: 'auto', width: '90%'}}
            className="text-p text-normal"
            onBlur={() => {
                setFieldError(null);
                setActionBtnDisabled(false);
            }}
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
                        if(isKeyPressed(e, "Enter")) {setShowMoreFields("field2", 1500); setData({ ...data, name: name.cap()}); handleFocus("field2");}
                    }}
                    onBlur={() => {
                        setShowMoreFields("field2", 1500);
                        handleFocus("field2");
                        setData({ ...data, name: name.cap()})
                    }}
                    autoComplete="off"
                    value={name}
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
            <div className={`animated slideInDown fast mt-3 ${handleShowFields("field2") ? "d-block" : "d-none"}`}>
                Ok, informe seu CPF
                <TextField
                    id="field2"
                    required
                    margin="dense"
                    onChange={handleChange(setData, data)}
                    error={errorCpf ? true : false}
                    name="cpf"
                    variant="outlined"
                    autoOk={false}
                    onKeyPress={e => {
                        if(isKeyPressed(e, "Enter")) { setShowMoreFields("field3"); handleFocus("field3", { delay: 800 }); setData({ ...data, cpf: cpfMaskBr(cpf)}); setSwitchNumToText(true); }
                    }}
                    onBlur={() => { setShowMoreFields("field3"); handleFocus("field3", { delay: 800 }); setData({ ...data, cpf: cpfMaskBr(cpf)}); setSwitchNumToText(true); }}
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
            <div className={`animated slideInDown fast mt-3 ${handleShowFields("field3") ? "d-block" : "d-none"}`}>
                {name
                ? <span>{name.cap()}, quando é o seu aniversário?</span>
                : <span>Quando é o seu aniversário?</span>}
                <MuiPickersUtilsProvider
                    utils={dateFnsUtils}
                    locale={ptBRLocale}
                >
                    <DatePicker
                        required
                        inputVariant="outlined"
                        margin="dense"
                        error={errorBirthday ? true : false}
                        openTo="year"
                        disableFuture={true}
                        allowKeyboardControl={true}
                        maxDate={new Date(`${maxYear}-12-31`)}
                        minDate={new Date("1940-01-01")}
                        autoOk={false}
                        views={["year", "month", "date"]}
                        name="birthday"
                        value={selectedDate}
                        onChange={e => {
                            handleDateChange(e._d)
                            setShowMoreFields("otherFields")
                            handleFocus("field4", { delay: 1500 })
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CakeIcon />
                            </InputAdornment>
                          ),
                          style: styles.fieldForm,
                          id: "field3"
                        }}
                    />
                </MuiPickersUtilsProvider>
            </div>
            <section className={`animated slideInLeft fast ${handleShowFields("otherFields")  ? "d-block" : "d-none"}`}>
                <p className="text-left my-2">Para finalizar seu cadastro...</p>
                <div className="mt-3">
                    Email
                    <TextField
                        id="field4"
                        required
                        margin="dense"
                        onChange={handleChange(setData, data)}
                        onKeyPress={e => isKeyPressed(e, "Enter") && handleFocus("field5")}
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
                        id="field5"
                        margin="dense"
                        onChange={handleChange(setData, data)}
                        error={errorPhone ? true : false}
                        onBlur={() => setData({ ...data, phone: phoneMaskBr(phone)})}
                        onKeyPress={e => isKeyPressed(e, "Enter") && setData({ ...data, phone: phoneMaskBr(phone)}) && handleFocus("field6")}
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
                      id="field6"
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
                onClick={registerThisUser}
                disabled={actionBtnDisabled ? true : false}
                title="Registrar"
                color="var(--mainWhite)"
                backgroundColor={"var(--themeSDark--" +  selfThemeSColor + ")"}
                backColorOnHover={"var(--themeSDark--" +  selfThemeSColor + ")"
}               iconFontAwesome={<FontAwesomeIcon icon="save" style={faStyle}/>}
                textTransform='uppercase'
            />
        </div>
    );

    return (
        <div className="my-5 position-relative" style={{overflowY: 'hidden'}}>
            <Card
                className="animated zoomIn fast card-elevation"
                style={styles.card}
            >
                {showTitle()}
                {showForm()}
                {showButtonActions()}
            </Card>
            {showLoginForm(needLoginBtn)}
        </div>
    );
}

export default React.memo(Register);

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