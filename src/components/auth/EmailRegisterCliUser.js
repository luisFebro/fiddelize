import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { removeCollection } from "init/lStorage";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import EmailIcon from "@material-ui/icons/Email";
import Card from "@material-ui/core/Card";
import ReactGA from "react-ga";
import useData, { useBizData } from "init";
import getColor from "styles/txt";
import { doRegister } from "auth/api";
// Helpers
import detectErrorField from "utils/validation/detectErrorField";
import handleChange from "utils/form/use-state/handleChange";
import { handleNextField } from "utils/form/kit";
import getFilterDate from "utils/dates/getFilterDate";
// import ButtonMulti, { faStyle } from "../buttons/material-ui/ButtonMulti";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import setStorageRegisterDone from "./helpers/setStorageRegisterDone";
import RadiusBtn from "../buttons/RadiusBtn";
import Title from "../Title";
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

export default function EmailRegisterCliUser({
    isStaff = false,
    callback,
    setLoginOrRegister,
    setSuccessfulRegister,
    needAlreadyRegisterBtn = false,
}) {
    const [actionBtnDisabled, setActionBtnDisabled] = useState(false);
    const [data, setData] = useState({
        role: "cliente",
        email: "",
        clientUserData: { bizId: "", filterBirthday: "" },
        filter,
        bizImg: "", // for account panel...
        bizName: "", // for account panel...
        staff: {},
        tempPoints: "", // for member tasks newClient Record
        memberRole: "", // for member tasks newClient Record
        linkCode: "",
        showAgreement: false,
    });
    // const [switchNumToText, setSwitchNumToText] = useState(false); // n1

    const styles = getStyles();

    const { email, showAgreement } = data;

    const {
        themePColor,
        themeSColor,
        themeBackColor,
        bizLogo,
        bizName,
        bizId,
    } = useBizData();
    const { txtColor } = getColor(themeBackColor);

    const [
        staffId,
        memberId,
        memberRole,
        memberRoleAlt,
        memberJob,
        memberName,
        encryptedPTS, // e.g Xx05h507075 the actual value is decrypted in back
        lastRegisterBizId,
        linkCode, // e.g cheries-beauty_febro:lw06K707a
        bizLinkName,
    ] = useData([
        "userId",
        "memberId",
        "memberRole",
        "role",
        "memberJob",
        "memberName",
        "encryptedPTS",
        "lastRegisterBizId",
        "linkCode",
        "bizLinkName",
    ]);

    const { name: appMemberName } = useData();

    const isReady = bizLogo && bizName && memberId !== "...";
    useEffect(() => {
        if (isReady) {
            setTimeout(() => {
                // this timeout is used because the data is not set otherwise. The reason is unknown.
                setData((prev) => ({
                    ...prev,
                    bizImg: bizLogo,
                    bizName,
                    staff: {
                        id: memberId || staffId,
                        job: memberJob || "admin",
                        role: memberRole || memberRoleAlt,
                        name: memberName || appMemberName,
                    },
                    tempPoints: encryptedPTS,
                    memberRole: memberRole || memberRoleAlt, // if not found memberRole, it means it is a complete register before sending link invitation.
                    clientUserData: {
                        ...data.clientUserData,
                        bizId: lastRegisterBizId || bizId,
                    },
                    linkCode,
                }));
            }, 4000);
        }
    }, [
        isReady,
        bizLogo,
        bizName,
        memberRole,
        memberId,
        memberJob,
        encryptedPTS,
    ]);

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
            }
            return null;
        });
        if (!ok) return null;

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
            const payload = { email };
            callback(payload);
        } else {
            setLoginOrRegister("login");
            setSuccessfulRegister(true);
            showToast(
                "Seu cadastro foi realizado com sucesso. Faça seu acesso.",
                { type: "success", dur: 10000 }
            );
            // sendEmail(res.data.authUserId);
        }

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
                    title="Acessar"
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
                subTitle={isStaff ? "Novo Cliente" : "É grátis."}
                color="var(--mainWhite)"
                needShadow
                backgroundColor={`var(--themePDark--${themePColor})`}
            />
        </div>
    );

    // this should be a tag link because Link erases all data when user returns back
    // const agreementTxtElem = (
    //     <span>
    //         Ao se cadastrar, você concorda com as{" "}
    //         <a
    //             className="text-link"
    //             href={`${CLIENT_URL}/${bizLinkName}/regras`}
    //             rel="noopener noreferrer"
    //             target="_blank"
    //         >
    //             regras do clube de compras
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
                elevation={isStaff ? false : undefined}
            >
                {showTitle()}
                {showForm()}
                {showButtonActions()}
            </Card>
            {needAlreadyRegisterBtn && showLoginForm()}
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
