import { useState, useEffect } from "react";
import ReactGA from "react-ga";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import Card from "@material-ui/core/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { removeCollection } from "init/lStorage";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import EmailIcon from "@material-ui/icons/Email";
import useData, { useBizData } from "init";
import getColor from "styles/txt";
import { doRegister } from "auth/api";
import detectErrorField from "utils/validation/detectErrorField";
import handleChange from "utils/form/use-state/handleChange";
import { handleNextField } from "utils/form/kit";
import getFilterDate from "utils/dates/getFilterDate";
import Title from "../Title";
import RadiusBtn from "../buttons/RadiusBtn";
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

export default function EmailRegisterBizTeam({
    setLoginOrRegister,
    setSuccessfulRegister,
}) {
    const [actionBtnDisabled, setActionBtnDisabled] = useState(false);
    // const [switchNumToText, setSwitchNumToText] = useState(false); // n1

    const {
        themePColor,
        themeSColor,
        themeBackColor,
        // bizLinkName,
    } = useBizData();

    const { txtColor } = getColor(themeBackColor);

    const [data, setData] = useState({
        role: "nucleo-equipe",
        email: "",
        bizTeamData: {
            job: "associado", // if rep-comercial, it should be manually set in DB for now.
            primaryAgent: "",
        },
        bizImg: "/img/official-logo-name.png", // for account panel...
        bizName: "fiddelize", // for account panel...
        showAgreement: false,
        filter,
    });

    const styles = getStyles();

    const { email } = data;

    const [primaryAgent] = useData(["primaryAgent"]);

    const isReady = primaryAgent !== "...";

    useEffect(() => {
        if (isReady) {
            // this timeout is used because the data is not set otherwise. The reason is unknown.
            setTimeout(() => {
                setData((prev) => {
                    return {
                        ...prev,
                        bizTeamData: {
                            ...data.bizTeamData,
                            primaryAgent: primaryAgent || "fiddelize",
                        },
                    };
                });
            }, 4000);
        }
    }, [isReady, primaryAgent]);
    // const { bizInfo } = useStoreState(state => ({
    //     bizInfo: state.adminReducer.cases.businessInfo,
    // }));

    // const { bizName, bizWebsite, bizInstagram } = bizInfo;

    // detecting field errors
    const [fieldError, setFieldError] = useState(null);
    const errorEmail = fieldError && fieldError.email;
    // end detecting field errors

    const clearData = () => {
        setData({
            email: "",
        });
        setFieldError(null);
        handleNextField(null, null, { clearFields: true });
    };

    const registerThisUser = async () => {
        setActionBtnDisabled(true);

        const newUser = {
            ...data,
        };

        if (!primaryAgent) {
            showToast(
                "O ID do app não foi encontrado. Tente reinstalar o app na página de convite.",
                { type: "error" }
            );
        }

        showToast("Registrando sua conta...", { dur: 15000 });

        const ok = await doRegister(newUser).catch((res) => {
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
        });

        if (!ok) return null;

        setStorageRegisterDone();

        ReactGA.event({
            category: "bizTeam",
            action: "Created an account",
            label: "form",
            nonInteraction: true,
            transport: "beacon",
        });

        removeCollection("onceChecked");
        clearData();

        setLoginOrRegister("login");
        setSuccessfulRegister(true);
        showToast("Seu cadastro foi realizado com sucesso. Faça seu acesso.", {
            type: "success",
            dur: 10000,
        });
        // sendEmail(res.data.authUserId);
        return true;
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
                title="Faça seu cadastro"
                subTitle=""
                color="var(--mainWhite)"
                needShadow
                backgroundColor={`var(--themePDark--${themePColor})`}
            />
        </div>
    );

    // this should be a tag link because Link erases all data when user returns back
    // const agreementTxtElem = (
    //     <span>
    //         Ao se cadastrar, você está de acordo com os nossos{" "}
    //         <a
    //             className="text-link"
    //             href={`${CLIENT_URL}/termos-de-uso`}
    //             rel="noopener noreferrer"
    //             target="_blank"
    //         >
    //             termos de uso
    //         </a>{" "}
    //     </span>
    // );

    const showForm = () => (
        <form
            style={{ margin: "auto", width: "90%" }}
            className="text-p text-normal"
            onBlur={() => {
                setFieldError(null);
                setActionBtnDisabled(false);
            }}
        >
            <section id="field1">
                <div className="mt-3">
                    Email
                    <TextField
                        required
                        margin="dense"
                        onChange={handleChange(setData, data)}
                        onKeyPress={() => null}
                        onBlur={() => null}
                        // handleNextField(e, "field4", { event: "onBlur" })
                        // }
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
            </section>
        </form>
    );

    const showButtonActions = () => (
        <div className="my-4 mx-5 container-center">
            <ButtonFab
                title="Registrar"
                disabled={!!actionBtnDisabled}
                width="100%"
                iconFontAwesome={
                    <FontAwesomeIcon
                        icon="save"
                        style={{
                            fontSize: 30,
                        }}
                    />
                }
                backgroundColor={`var(--themeSDark--${themeSColor})`}
                onClick={registerThisUser}
                position="relative"
                variant="extended"
                size="large"
            />
        </div>
    );

    return (
        <div className="my-5 position-relative" style={{ overflowY: "hidden" }}>
            <Card
                className="animated zoomIn fast card-elevation"
                style={styles.card}
                elevation={undefined}
            >
                {showTitle()}
                {showForm()}
                {showButtonActions()}
            </Card>
            {showLoginForm()}
        </div>
    );
}

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
