import React, { useEffect, useState } from "react";
import PhoneIphoneIcon from "@material-ui/icons/PhoneIphone";
import CakeIcon from "@material-ui/icons/Cake";
import Card from "@material-ui/core/Card";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import AccountCircle from "@material-ui/icons/AccountCircle";
import EmailIcon from "@material-ui/icons/Email";
import MoneyIcon from "@material-ui/icons/Money";
import ReactGA from "react-ga";
import autoPhoneMask from "utils/validation/masks/autoPhoneMask";
import autoCpfMaskBr from "utils/validation/masks/autoCpfMaskBr";
import getDayMonthBr from "utils/dates/getDayMonthBr";
import { doRegister } from "auth/api";
import detectErrorField from "utils/validation/detectErrorField";
import handleChange from "utils/form/use-state/handleChange";
import { handleNextField } from "utils/form/kit";
import setValObjWithStr from "utils/objects/setValObjWithStr";
import { dateFnsUtils, ptBRLocale } from "utils/dates/dateFns";
import getFilterDate from "utils/dates/getFilterDate";
import useData, { useBizData } from "init";
import getVar, { removeStore } from "init/var";
import getFirstName from "utils/string/getFirstName";
import { CLIENT_URL } from "config/clientUrl";
import sendEmail from "hooks/email/sendEmail";
import SafeEnvironmentMsg from "../SafeEnvironmentMsg";
import Title from "../Title";
import ButtonMulti, { faStyle } from "../buttons/material-ui/ButtonMulti";
import showToast from "../toasts";
// import CheckBoxForm from "../CheckBoxForm";
// import ReCaptchaCheckbox from "../ReCaptcha";

const filter = getFilterDate();

const isSmall = window.Helper.isSmallScreen();

// const useStyles = makeStyles((theme) => ({
//     card: {
//         maxWidth: 345,
//         filter: "drop-shadow(.001em .001em .15em var(--mainDark))",
//     },
// }));

const getStyles = () => ({
    fieldForm: {
        backgroundColor: "var(--mainWhite)",
        color: "var(--themeP)",
        zIndex: 2000,
        font: "normal 1em Poppins, sans-serif",
    },
    helperFromField: {
        color: "grey",
        fontFamily: "Poppins, sans-serif",
        fontSize: isSmall ? ".8em" : ".6em",
    },
    card: {
        margin: "auto",
        width: "90%",
        maxWidth: isSmall ? "" : 360,
        boxShadow: "0 31px 120px -6px rgba(0, 0, 0, 0.35)",
    },
});

function RegisterClientAdmin({ logo }) {
    const [switchNumToText, setSwitchNumToText] = useState(false); // n1

    const dateNow = new Date();
    const minAge = 16;
    const maxYear = dateNow.getFullYear() - minAge;
    dateNow.setFullYear(maxYear);
    const [selectedDate, handleDateChange] = useState(dateNow);

    const [data, setData] = useState({
        role: "cliente-admin",
        name: "",
        clientAdminData: { bizWhatsapp: "" },
        email: "",
        phone: "",
        birthday: "",
        cpf: "",
        gender: "selecione forma tratamento",
        filter,
        bizImg: "", // for account panel...
        bizName: "", // for account panel...
        referrer: "",
        showAgreement: false,
    });
    const {
        name,
        clientAdminData,
        email,
        gender,
        cpf,
        phone,
        showAgreement,
        // birthday,
        // role,
    } = data;

    const cpfValue = autoCpfMaskBr(cpf);
    const phoneValue = autoPhoneMask(phone);

    const [preRegisterCliAdminData, bizTeamReferrer] = useData(
        ["clientAdminData", "referrer"],
        "pre_register"
    );

    useEffect(() => {
        const isReady = preRegisterCliAdminData !== "...";
        if (isReady) {
            setTimeout(() => {
                // this timeout is used because the data is not set otherwise. The reason is unknown.
                const { bizLogo, bizName } = preRegisterCliAdminData;
                setData((prev) => ({
                    ...prev,
                    bizImg: bizLogo,
                    bizName,
                    clientAdminData: {
                        ...prev.clientAdminData,
                        ...preRegisterCliAdminData,
                    },
                    referrer: bizTeamReferrer || "dev-fiddelize",
                }));
            }, 4000);
        }
    }, [preRegisterCliAdminData, bizTeamReferrer]);

    // detecting field errors
    const [fieldError, setFieldError] = useState(null);
    const errorName = fieldError && fieldError.name;
    const errorEmail = fieldError && fieldError.email;
    const errorGender = fieldError && fieldError.gender;
    const errorBirthday = fieldError && fieldError.birthday;
    const errorCpf = fieldError && fieldError.cpf;
    const errorPhone = fieldError && fieldError.phone;
    // end detecting field errors

    const { bizLogo } = useBizData();

    const styles = getStyles();

    useEffect(() => {
        const opts = { needYear: true };
        setData({ ...data, birthday: getDayMonthBr(selectedDate, opts) });
    }, [selectedDate]);

    useEffect(() => {
        phone && setValObjWithStr(data, "clientAdminData.bizWhatsapp", phone);
    }, [phone]);

    const clearData = () => {
        setData({
            role: "cliente-admin",
            name: "",
            email: "",
            phone: "",
            birthday: "",
            cpf: "",
            gender: "selecione forma tratamento",
        });
        setFieldError(null);
    };

    const registerThisUser = async () => {
        clientAdminData.bizWhatsapp = phone;
        const newUser = {
            ...data,
        };

        showToast("Registrando sua conta...", { dur: 15000 });
        const ok = await doRegister(newUser).catch((res) => {
            if (res.status !== 200 && res.data) {
                showToast(res.data.msg || res.data.error, { type: "error" });
                // detect field errors
                const thisModalFields = Object.keys(data);
                const foundObjError = detectErrorField(
                    res.data.msg,
                    thisModalFields
                );
                setFieldError(foundObjError);
            }
            return null;
        });

        if (!ok) return null;

        // if (!agreementDone) {
        //     return showToast(
        //         "Clique na caixa para concordar com termos de uso e privacidade",
        //         { type: "error" }
        //     );
        // }

        const { bizName } = clientAdminData;
        const cliAdminName = getFirstName(name);

        showToast("Redirecionando...");

        ReactGA.event({
            // n1
            label: "Form",
            category: "cliAdmin",
            action: "Created an account",
            transport: "beacon",
        });

        const emailPayload = {
            toEmail: email,
            gender,
            name,
            bizName,
        };

        sendEmail({
            type: "registerWelcome",
            payload: emailPayload,
        });

        const dataCliAdmin = await getVar("clientAdminData", "pre_register");
        const { themeBackColor, themePColor, themeSColor } = dataCliAdmin;
        window.location.href = `/baixe-app/${cliAdminName}?negocio=${bizName}&logo=${logo}&admin=1&bc=${
            themeBackColor || "default"
        }&c1=${themePColor || "default"}&c2=${themeSColor || "default"}`;
        // Lesson: this await was preventing a tablet to redirect properly to the next page.
        await removeStore("pre_register");
        clearData();

        return true;
    };

    const showTitle = () => (
        <div className="position-relative">
            <Title
                title="Uma conta"
                subTitle="Acesse todos seus apps"
                color="var(--mainWhite)"
                backgroundColor="var(--themePDark)"
            />
        </div>
    );

    // this should be a tag link because Link erases all data when user returns back
    const agreementTxtElem = (
        <span>
            Ao se cadastrar, você está de acordo com os nossos{" "}
            <a
                className="text-link"
                href={`${CLIENT_URL}/termos-de-uso`}
                rel="noopener noreferrer"
                target="_blank"
            >
                termos de uso
            </a>{" "}
        </span>
    );

    const showForm = () => (
        <form
            style={{ margin: "auto", width: "90%" }}
            className="text-p text-normal"
            onBlur={() => setFieldError(null)}
        >
            <div id="field1" className="mt-3">
                qual é o seu nome e sobrenome?
                <TextField
                    required
                    onChange={handleChange(setData, data)}
                    error={!!errorName}
                    variant="outlined"
                    margin="dense"
                    name="name"
                    value={name}
                    onKeyPress={(e) => {
                        handleNextField(e, "field1", {
                            callback: () =>
                                setData({ ...data, name: name.cap() }),
                        });
                    }}
                    onBlur={(e) => {
                        handleNextField(e, "field1", {
                            event: "onBlur",
                            callback: () =>
                                setData({ ...data, name: name.cap() }),
                        });
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
                    }}
                />
            </div>
            <div id="field2" className="d-none animated fadeInUp fast mt-3">
                Ok, informe seu CPF
                <TextField
                    required
                    margin="dense"
                    onChange={handleChange(setData, data)}
                    error={!!errorCpf}
                    name="cpf"
                    variant="outlined"
                    autoOk={false}
                    onKeyPress={(e) => {
                        handleNextField(e, "field2", {
                            callback: () => {
                                setData({ ...data, cpf: autoCpfMaskBr(cpf) });
                                setSwitchNumToText(true);
                            },
                        });
                    }}
                    onBlur={(e) => {
                        handleNextField(e, "field2", {
                            event: "onBlur",
                            callback: () => {
                                setData({ ...data, cpf: autoCpfMaskBr(cpf) });
                                setSwitchNumToText(true);
                            },
                        });
                    }}
                    value={cpfValue}
                    type={switchNumToText ? "text" : "tel"}
                    autoComplete="off"
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <MoneyIcon />
                            </InputAdornment>
                        ),
                        style: styles.fieldForm,
                        id: "value2",
                    }}
                />
            </div>
            <div id="field3" className="d-none animated fadeInUp fast mt-3">
                {name ? (
                    <span>{name.cap()}, quando é o seu aniversário?</span>
                ) : (
                    <span>Quando é o seu aniversário?</span>
                )}
                <MuiPickersUtilsProvider
                    utils={dateFnsUtils}
                    locale={ptBRLocale}
                >
                    <DatePicker
                        required
                        inputVariant="outlined"
                        margin="dense"
                        error={!!errorBirthday}
                        openTo="year"
                        autoOk={false}
                        disableFuture
                        allowKeyboardControl
                        maxDate={new Date(`12-31-${maxYear}`)}
                        minDate={new Date("01-01-1940")}
                        views={["year", "month", "date"]}
                        name="birthday"
                        value={selectedDate}
                        onChange={(e) => {
                            handleDateChange(e);
                            setData({ ...data, showAgreement: true });
                            handleNextField(e, "field3", {
                                event: "onChange",
                                ignoreValue: true,
                            });
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CakeIcon />
                                </InputAdornment>
                            ),
                            style: styles.fieldForm,
                            id: "value3",
                        }}
                    />
                </MuiPickersUtilsProvider>
            </div>
            <section id="field4" className="d-none animated slideInUp fast">
                <p className="my-2 font-site text-em-0-8 text-grey text-left my-2">
                    Para finalizar seu cadastro...
                </p>
                <div className="mt-3">
                    Email
                    <TextField
                        required
                        margin="dense"
                        onChange={handleChange(setData, data)}
                        onKeyPress={(e) => handleNextField(e, "field5")}
                        onBlur={(e) =>
                            handleNextField(e, "field4", { event: "onBlur" })
                        }
                        error={!!errorEmail}
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
                            id: "value4",
                        }}
                    />
                </div>
                <div id="field5" className="mt-3">
                    Celular/Whatsapp
                    <TextField
                        required
                        margin="dense"
                        onChange={handleChange(setData, data)}
                        error={!!errorPhone}
                        onKeyPress={(e) => {
                            handleNextField(e, "field5", {
                                callback: () =>
                                    setData({
                                        ...data,
                                        phone: autoPhoneMask(phone),
                                    }),
                            });
                        }}
                        onBlur={(e) => {
                            handleNextField(e, "field5", {
                                event: "onBlur",
                                callback: () =>
                                    setData({
                                        ...data,
                                        phone: autoPhoneMask(phone),
                                    }),
                            });
                        }}
                        name="phone"
                        value={phoneValue}
                        helperText="Digite com DDD"
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
                            id: "value5",
                        }}
                    />
                </div>
                <div id="field6" className="my-3">
                    <Select
                        id="value6"
                        margin="dense"
                        labelId="gender"
                        onChange={handleChange(setData, data)}
                        name="gender"
                        fullWidth
                        value={gender}
                        variant="outlined"
                        error={!!errorGender}
                        style={{ backgroundColor: "var(--mainWhite)" }}
                    >
                        <MenuItem value={gender}>
                            <span
                                className="text-p text-normal"
                                style={{
                                    fontSize: isSmall ? "1.1em" : "",
                                    fontFamily: "Poppins, sans-serif",
                                }}
                            >
                                selecione forma tratamento:
                            </span>
                        </MenuItem>
                        <MenuItem value="Ela">Ela</MenuItem>
                        <MenuItem value="Ele">Ele</MenuItem>
                    </Select>
                </div>
            </section>
            {showAgreement && (
                <section className="mt-4 text-small font-weight-bold">
                    {agreementTxtElem}
                </section>
            )}
            <SafeEnvironmentMsg mt={showAgreement ? "mt-3" : ""} />
        </form>
    );

    const showButtonActions = () => (
        <div className="container-center">
            <ButtonMulti
                onClick={registerThisUser}
                color="var(--mainWhite)"
                backgroundColor="var(--themeSDark)"
                backColorOnHover="var(--themeSDark)"
                iconFontAwesome={
                    <FontAwesomeIcon icon="save" style={faStyle} />
                }
                textTransform="uppercase"
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
