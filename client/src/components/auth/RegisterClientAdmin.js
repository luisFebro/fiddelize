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
import lStorage from '../../utils/storage/lStorage';
import { handleNextField } from '../../utils/form/kit';
import setValObjWithStr from '../../utils/objects/setValObjWithStr';
import { getUniqueCodeName } from '../../utils/string/generateAlphaNumeric';
import addDashesToString from '../../utils/string/addDashesToString';
import { dateFnsUtils, ptBRLocale } from '../../utils/dates/dateFns';
// Material Ui
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import EmailIcon from '@material-ui/icons/Email';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoneyIcon from '@material-ui/icons/Money';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import CakeIcon from '@material-ui/icons/Cake';
import Card from '@material-ui/core/Card';
import ButtonMulti, {faStyle} from '../buttons/material-ui/ButtonMulti';
import ReactGA from 'react-ga';

const isSmall = window.Helper.isSmallScreen();

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 345,
        filter: 'drop-shadow(.001em .001em .15em var(--mainDark))',
    }
}));

const getStyles = () => ({
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
});

function RegisterClientAdmin({ setLoginOrRegister, needLoginBtn }) {
    const [switchNumToText, setSwitchNumToText] = useState(false); //n1

    const dateNow = new Date();
    const minAge = 16;
    const maxYear = dateNow.getFullYear() - minAge;
    dateNow.setFullYear(maxYear);
    const [selectedDate, handleDateChange] = useState(dateNow);

    const [data, setData] = useState({
        role: 'cliente-admin',
        name: '',
        clientAdminData: { bizName: '', bizCodeName: '', bizWhatsapp: ''},
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
    const styles = getStyles();

    useEffect(() => {
        const opts = { needYear: true };
        setData({ ...data, birthday: getDayMonthBr(selectedDate, opts) })
    }, [selectedDate])

    useEffect(() => {
        const thisBizName = clientAdminData.bizName;
        if(thisBizName) {
            const bizCode = getUniqueCodeName(thisBizName);
            const finalDashedName = `${addDashesToString(`${thisBizName}`)}-${bizCode}`
            setValObjWithStr(data, "clientAdminData.bizCodeName", finalDashedName);
        }
    }, [clientAdminData.bizName])

    useEffect(() => {
        phone && setValObjWithStr(data, "clientAdminData.bizWhatsapp", phone);
    }, [phone])

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
        clientAdminData.bizWhatsapp = phone;
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

            const userId = res.data.authUserId;

            ReactGA.event({ // n1
                label: 'Form',
                category: 'UserCliAdmin',
                action: 'Created an account',
                transport: 'beacon',
            });

            const removalOptions = {
                collection: "onceChecked",
            }
            lStorage("removeItems", removalOptions);

            // window.location.href reloads the page to trigger PWA beforeInstall. history.push does not reload the target page...
            setTimeout(() => window.location.href = `/${clientAdminData.bizCodeName}/novo-app?id=${res.data.authUserId}&bizName=${clientAdminData.bizName}&name=${name}`, 500);

            sendEmail(userId);

        })
    };

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
                title="Comece Aqui!"
                subTitle="Cadastre-se."
                color="var(--mainWhite)"
                backgroundColor="var(--themePDark)"
            />
            {showLoginForm(needLoginBtn)}
        </div>
    );

    const showForm = () => (
        <form
            style={{margin: 'auto', width: '90%'}}
            className="text-p text-normal"
            onBlur={() => setFieldError(null)}
        >
            <div id="field1" className="mt-3">
                Empreendedor(a),<br />qual é o seu nome?
                <TextField
                    required
                    onChange={handleChange(setData, data)}
                    error={errorName ? true : false}
                    variant="outlined"
                    margin="dense"
                    name="name"
                    value={name}
                    onKeyPress={e => { handleNextField(e, "field1", { callback: () => setData({ ...data, name: name.cap()}) }); }}
                    onBlur={e => { handleNextField(e, "field1", { event: "onBlur", callback: () => setData({ ...data, name: name.cap()}) }); }}
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
            <div id="field2" className={`d-none animated slideInLeft fast mt-3`}>
                Qual é o nome do<br />seu projeto/empresa?
                <TextField
                    required
                    onChange={handleChange(setData, data, true)}
                    error={errorBizName ? true : false}
                    variant="outlined"
                    margin="dense"
                    name="clientAdminData.bizName"
                    value={clientAdminData.bizName}
                    onKeyPress={e => { handleNextField(e, "field2"); setValObjWithStr(data, "clientAdminData.bizName", clientAdminData.bizName.cap()); }}
                    onBlur={e => {
                        handleNextField(e, "field2", { event: "onBlur" });
                        setValObjWithStr(data, "clientAdminData.bizName", clientAdminData.bizName.cap());
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
                      style: styles.fieldForm,
                      id: "value2"
                    }}
                />
            </div>
            <div id="field3" className={`d-none animated fadeInUp fast mt-3`}>
                Ok, informe seu CPF
                <TextField
                    required
                    margin="dense"
                    onChange={handleChange(setData, data)}
                    error={errorCpf ? true : false}
                    name="cpf"
                    variant="outlined"
                    autoOk={false}
                    onKeyPress={e => {  handleNextField(e, "field3", { callback: () => { setData({ ...data, cpf: cpfMaskBr(cpf)}); setSwitchNumToText(true); } }); }}
                    onBlur={e => { handleNextField(e, "field3", { event: "onBlur", callback: () => { setData({ ...data, cpf: cpfMaskBr(cpf)}); setSwitchNumToText(true); } }); }}
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
                      style: styles.fieldForm,
                      id: "value3"
                    }}
                />
            </div>
            <div id="field4" className={`d-none animated fadeInUp fast mt-3`}>
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
                        autoOk={false}
                        disableFuture={true}
                        allowKeyboardControl={true}
                        maxDate={new Date(`12-31-${maxYear}`)}
                        minDate={new Date("01-01-1940")}
                        views={["year", "month", "date"]}
                        name="birthday"
                        value={selectedDate}
                        onChange={e => {
                            handleDateChange(e)
                            handleNextField(e, "field4", { event: "onChange", ignoreValue: true });
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CakeIcon />
                            </InputAdornment>
                          ),
                          style: styles.fieldForm,
                          id: "value4"
                        }}
                    />
                </MuiPickersUtilsProvider>
            </div>
            <section id="field5" className={`d-none animated slideInUp fast`}>
                <p className="text-left my-2">Para finalizar seu cadastro...</p>
                <div className="mt-3">
                    Email
                    <TextField
                        required
                        margin="dense"
                        onChange={handleChange(setData, data)}
                        onKeyPress={e => handleNextField(e, "field5")}
                        onBlur={e => handleNextField(e, "field5", { event: "onBlur" })}
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
                          style: styles.fieldForm,
                          id: "value5",
                        }}
                    />
                </div>
                <div id="field6" className="mt-3">
                    Contato/Whatsapp
                    <TextField
                        required
                        margin="dense"
                        onChange={handleChange(setData)}
                        error={errorPhone ? true : false}
                        onKeyPress={e => { handleNextField(e, "field6", { callback: () => setData({ ...data, phone: phoneMaskBr(phone)}) });  }}
                        onBlur={e => { handleNextField(e, "field6", { event: "onBlur", callback: () => setData({ ...data, phone: phoneMaskBr(phone)}) });  }}
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
                          style: styles.fieldForm,
                          id: "value6",
                        }}
                    />
                </div>
                <div id="field7" className="my-3">
                    <Select
                      id="value7"
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
                iconFontAwesome={<FontAwesomeIcon icon="save" style={faStyle} />}
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
n2:
One thing to note is if your user is submitting a form you can specify the     transport: beacon property in your event hit, which will let you reliably send the hit even if the page is reloaded to another page. This isn't so much of an issue in a single page app like React, but if you did want to do this, just know this option is available
https://www.freecodecamp.org/news/performance-and-user-tracking-in-react-with-google-analytics/
*/