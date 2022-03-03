import { useEffect, useState } from "react";
import Card from "@material-ui/core/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import EmailIcon from "@material-ui/icons/Email";
import ReactGA from "react-ga";
import { doRegister } from "auth/api";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import detectErrorField from "utils/validation/detectErrorField";
import handleChange from "utils/form/use-state/handleChange";
import getFilterDate from "utils/dates/getFilterDate";
import useData from "init";
import getVar, { removeStore } from "init/var";
// import { CLIENT_URL } from "config/clientUrl";
import sendEmail from "hooks/email/sendEmail";
import Title from "../Title";
import { faStyle } from "../buttons/material-ui/ButtonMulti";
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

export default function Register({ logo, role = "cliente-admin" }) {
    const [data, setData] = useState({
        role,
        email: "",
        bizImg: "", // for account panel...
        bizName: "", // for account panel...
        referrer: "",
        filter,
        // showAgreement: false,
    });
    console.log("data FUCK", data);
    const {
        clientAdminData,
        email,
        // showAgreement,
        // birthday,
        // role,
    } = data;

    const [preRegisterCliAdminData, bizTeamReferrer] = useData(
        ["clientAdminData", "referrer"],
        "pre_register"
    );

    useEffect(() => {
        const isReady = preRegisterCliAdminData !== "...";
        if (!isReady) return;

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
    }, [preRegisterCliAdminData, bizTeamReferrer]);

    // detecting field errors
    const [fieldError, setFieldError] = useState(null);
    const errorEmail = fieldError && fieldError.email;
    // const errorBirthday = fieldError && fieldError.birthday;
    // const errorGender = fieldError && fieldError.gender;
    // const errorCpf = fieldError && fieldError.cpf;
    // const errorPhone = fieldError && fieldError.phone;
    // const errorName = fieldError && fieldError.name;
    // end detecting field errors

    const styles = getStyles();

    const clearData = () => {
        setData({
            role,
            email: "",
            bizImg: "", // for account panel...
            bizName: "", // for account panel...
            referrer: "",
        });
        setFieldError(null);
    };

    const registerThisUser = async () => {
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
            bizName,
        };

        sendEmail({
            type: "registerWelcome",
            payload: emailPayload,
        });

        const dataCliAdmin = await getVar("clientAdminData", "pre_register");
        const { themeBackColor, themePColor, themeSColor } = dataCliAdmin;
        window.location.href = `/baixe-app/cli?negocio=${bizName}&logo=${logo}&admin=1&bc=${
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
                title="Cadastro"
                subTitle={false}
                color="var(--mainWhite)"
                backgroundColor="var(--themePDark)"
            />
        </div>
    );

    const showForm = () => (
        <form
            style={{ margin: "auto", width: "90%" }}
            className="text-p text-normal"
            onBlur={() => setFieldError(null)}
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
                width="100%"
                iconFontAwesome={
                    <FontAwesomeIcon
                        icon="save"
                        style={{
                            fontSize: 30,
                        }}
                    />
                }
                backgroundColor="var(--themeSDark)"
                onClick={registerThisUser}
                position="relative"
                variant="extended"
                size="large"
            />
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

/*

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

 */
