import React, { useEffect, useState } from "react";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { removeCollection } from "init/lStorage";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import EmailIcon from "@material-ui/icons/Email";
import MoneyIcon from "@material-ui/icons/Money";
import AccountCircle from "@material-ui/icons/AccountCircle";
import PhoneIphoneIcon from "@material-ui/icons/PhoneIphone";
import CakeIcon from "@material-ui/icons/Cake";
import Card from "@material-ui/core/Card";
import ReactGA from "react-ga";
import Title from "../Title";
import autoPhoneMask from "../../utils/validation/masks/autoPhoneMask";
import autoCpfMaskBr from "../../utils/validation/masks/autoCpfMaskBr";
import getDayMonthBr from "../../utils/dates/getDayMonthBr";
import SafeEnvironmentMsg from "../SafeEnvironmentMsg";
import RadiusBtn from "../buttons/RadiusBtn";
import { doRegister } from "auth/api";
// Helpers
import detectErrorField from "../../utils/validation/detectErrorField";
import handleChange from "../../utils/form/use-state/handleChange";
import useData, { useBizData } from "init";
import setValObjWithStr from "../../utils/objects/setValObjWithStr";
import getDateCode from "../../utils/dates/getDateCode";
import ButtonMulti, { faStyle } from "../buttons/material-ui/ButtonMulti";
import { dateFnsUtils, ptBRLocale } from "../../utils/dates/dateFns";
import { handleNextField } from "../../utils/form/kit";
import getFilterDate from "../../utils/dates/getFilterDate";
import setStorageRegisterDone from "./helpers/setStorageRegisterDone";
import showToast from "../toasts";

const filter = getFilterDate();

const isSmall = window.Helper.isSmallScreen();

const getStyles = () => ({
    fieldForm: {
        backgroundColor: "var(--mainWhite)",
        // zIndex: 2000,
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
    },
});

function ASyncRegisterCliUser({
    isStaff = false,
    callback,
    setLoginOrRegister,
}) {
    const [actionBtnDisabled, setActionBtnDisabled] = useState(false);
    const [switchNumToText, setSwitchNumToText] = useState(false); // n1
    const [data, setData] = useState({
        role: "cliente",
        name: "",
        email: "",
        phone: "",
        birthday: "",
        cpf: "",
        gender: "selecione forma tratamento",
        clientUserData: { bizId: "", filterBirthday: "" },
        filter,
        bizImg: "", // for account panel...
        bizName: "", // for account panel...
        register: {},
        tempPoints: "", // for member tasks newClient Record
        memberRole: "", // for member tasks newClient Record
        linkCode: "",
    });

    const styles = getStyles();

    const dateNow = new Date();
    const minAge = 16;
    const maxYear = dateNow.getFullYear() - minAge;
    dateNow.setFullYear(maxYear);
    const [selectedDate, handleDateChange] = useState(dateNow);

    const { name, email, gender, cpf, phone } = data;
    const cpfValue = autoCpfMaskBr(cpf);
    const phoneValue = autoPhoneMask(phone);

    const { themePColor, themeSColor, bizLogo, bizName } = useBizData();

    const [
        staffId,
        memberId,
        memberRole,
        memberRoleAlt,
        memberJob,
        userScore,
        lastRegisterBizId,
        linkCode,
    ] = useData([
        "userId",
        "memberId",
        "memberRole",
        "role",
        "memberJob",
        "userScore",
        "lastRegisterBizId",
        "linkCode",
    ]);

    const isReady = bizLogo && bizName && memberId !== "...";
    useEffect(() => {
        if (isReady) {
            setTimeout(() => {
                // this timeout is used because the data is not set otherwise. The reason is unknown.
                setData((prev) => ({
                    ...prev,
                    bizImg: bizLogo,
                    bizName,
                    register: {
                        id: memberId || staffId,
                        job: memberJob || "admin",
                    },
                    tempPoints: userScore,
                    memberRole: memberRole || memberRoleAlt, // if not found memberRole, it means it is a complete register before sending link invitation.
                    clientUserData: {
                        ...data.clientUserData,
                        bizId: lastRegisterBizId,
                    },
                    linkCode,
                }));
            }, 4000);
        }
    }, [isReady, bizLogo, bizName, memberRole, memberId, memberJob, userScore]);

    // const { bizInfo } = useStoreState(state => ({
    //     bizInfo: state.adminReducer.cases.businessInfo,
    // }));

    // const { bizName, bizWebsite, bizInstagram } = bizInfo;

    // detecting field errors
    const [fieldError, setFieldError] = useState(null);
    const errorName = fieldError && fieldError.name;
    const errorEmail = fieldError && fieldError.email;
    const errorGender = fieldError && fieldError.gender;
    const errorBirthday = fieldError && fieldError.birthday;
    const errorCpf = fieldError && fieldError.cpf;
    const errorPhone = fieldError && fieldError.phone;
    // end detecting field errors

    useEffect(() => {
        if (selectedDate) {
            const opts = { needYear: true };
            const thisBirthDate = getDayMonthBr(selectedDate, opts);
            const { code: thisBirthCode } = getDateCode(thisBirthDate);

            setData({ ...data, birthday: thisBirthDate });
            setValObjWithStr(
                data,
                "clientUserData.filterBirthday",
                thisBirthCode
            );
        }
    }, [selectedDate]);

    const clearData = () => {
        setData({
            name: "",
            email: "",
            phone: "",
            birthday: "",
            cpf: "",
            gender: "selecione forma tratamento",
        });
        setFieldError(null);
        handleNextField(null, null, { clearFields: true });
    };

    const registerThisUser = (e) => {
        setActionBtnDisabled(true);

        const newUser = {
            ...data,
        };

        if (!lastRegisterBizId) {
            showToast(
                "O ID do app não foi encontrado. Tente reinstalar o app na página de convite.",
                { type: "error" }
            );
        }

        showToast("Registrando... Aguarde um momento.", { dur: 4000 });

        doRegister(newUser).then((res) => {
            if (res.status !== 200) {
                showToast(res.data.msg || res.data.error, { type: "error" });
                // detect field errors
                const thisModalFields = Object.keys(data);
                const foundObjError = detectErrorField(
                    res.data.msg,
                    thisModalFields
                );
                setFieldError(foundObjError);
                return;
            }

            setStorageRegisterDone();

            ReactGA.event({
                category: "cliUser",
                action: "Created an account",
                label: "form",
                nonInteraction: true,
                transport: "beacon",
            });

            if (!isStaff) removeCollection("onceChecked");

            clearData();

            if (isStaff) {
                const payload = { name, phone, email };
                callback(payload);
            } else {
                setLoginOrRegister("login");
                showToast(
                    `${name}, seu cadastro foi realizado com sucesso. Faça seu acesso.`,
                    { type: "success", dur: 10000 }
                );
                // sendEmail(res.data.authUserId);
            }
        });
    };

    const showLoginForm = () => (
        <div className="container-center animated zoomIn delay-2s position-relative p-2 mt-3">
            <p
                className={`${txtColor} m-0 font-weight-bold text-small`}
                style={{ whiteSpace: "nowrap" }}
            >
                Já foi cadastrado(a)?{"  "}
            </p>
            <div className="pl-2">
                <RadiusBtn
                    size="small"
                    title="Faça login"
                    onClick={() => {
                        // setStorageRegisterDone runs when there is a success login. If not successful login, back to registration form
                        setLoginOrRegister("login");
                    }}
                    backgroundColor={`var(--themeSDark--${themeSColor})`}
                />
            </div>
        </div>
    );

    const showTitle = () => (
        <div className="position-relative">
            <Title
                title={isStaff ? "Cadastro" : "Cadastre-se!"}
                subTitle={isStaff ? "Novo Cliente" : "É rápido e fácil."}
                color="var(--mainWhite)"
                needShadow
                backgroundColor={`var(--themePDark--${themePColor})`}
            />
        </div>
    );

    const showForm = () => (
        <form
            style={{ margin: "auto", width: "90%" }}
            className="text-p text-normal"
            onBlur={() => {
                setFieldError(null);
                setActionBtnDisabled(false);
            }}
        >
            <div id="field1" className="mt-3">
                {isStaff
                    ? "Qual nome do cliente?"
                    : "Qual é o seu nome e sobrenome?"}
                <TextField
                    required
                    onChange={handleChange(setData, data)}
                    error={!!errorName}
                    variant="outlined"
                    margin="dense"
                    id="name"
                    name="name"
                    onKeyPress={(e) => {
                        handleNextField(e, "field1", {
                            callback: () =>
                                setData({ ...data, name: name && name.cap() }),
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
                    value={name}
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
            <div id="field2" className="d-none animated slideInLeft fast mt-3">
                {isStaff ? "Ok, informe CPF do cliente" : "Ok, informe seu CPF"}
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
                {isStaff ? (
                    "Quando é aniversário do cliente?"
                ) : name ? (
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
                        disableFuture
                        allowKeyboardControl
                        maxDate={new Date(`${maxYear}-12-31`)}
                        minDate={new Date("1940-01-01")}
                        autoOk={false}
                        views={["year", "month", "date"]}
                        name="birthday"
                        value={selectedDate}
                        onChange={(e) => {
                            handleDateChange(e);
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
                <p className="text-left my-2">Para finalizar o cadastro...</p>
                <div className="mt-3">
                    Email
                    <TextField
                        required
                        margin="dense"
                        onChange={handleChange(setData, data)}
                        onKeyPress={(e) => handleNextField(e, "field4")}
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
                    Contato
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
                        helperText="Digite com DDD"
                        FormHelperTextProps={{ style: styles.helperFromField }}
                        value={phoneValue}
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
                        margin="dense"
                        labelId="gender"
                        id="value6"
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
            <SafeEnvironmentMsg />
        </form>
    );

    const showButtonActions = () => (
        <div className="container-center">
            <ButtonMulti
                onClick={registerThisUser}
                disabled={!!actionBtnDisabled}
                title="Registrar"
                color="var(--mainWhite)"
                backgroundColor={`var(--themeSDark--${themeSColor})`}
                backColorOnHover={`var(--themeSDark--${themeSColor})`}
                iconFontAwesome={
                    <FontAwesomeIcon icon="save" style={faStyle} />
                }
                textTransform="uppercase"
            />
        </div>
    );

    return (
        <div className="my-5 position-relative" style={{ overflowY: "hidden" }}>
            <Card
                className="animated zoomIn fast card-elevation"
                style={styles.card}
                elevation={isStaff ? false : undefined}
            >
                {showTitle()}
                {showForm()}
                {showButtonActions()}
            </Card>
            {showLoginForm()}
        </div>
    );
}

export default React.memo(ASyncRegisterCliUser);

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
