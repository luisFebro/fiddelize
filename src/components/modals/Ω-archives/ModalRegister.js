import { useState, useEffect, Fragment } from "react";
import { useStoreState, useStoreDispatch } from "easy-peasy";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import EmailIcon from "@material-ui/icons/Email";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ToggleVisibilityPassword from "../forms/fields/ToggleVisibilityPassword";
import ReCaptchaCheckbox from "../ReCaptcha";
// Helpers
import detectErrorField from "../../utils/validation/detectErrorField";
import clearForm from "../../utils/form/use-state/clearForm";
import handleChange from "../../utils/form/use-state/handleChange";
// End Helpers
import ButtonMulti from "../buttons/material-ui/ButtonMulti";
// Redux
import { showSnackbar } from "../../redux/actions/snackbarActions";
import { showModalLogin, closeModal } from "../../redux/actions/modalActions";
import { readUserList } from "../../redux/actions/userActions";
import { sendWelcomeConfirmEmail } from "../../redux/actions/emailActions";
import { registerEmail } from "../../redux/actions/authActions";
// Material UI
// End Material UI

export default function ModalRegister() {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        reCaptchaToken: null,
    });
    const { name, email, password, reCaptchaToken } = data;

    // detecting field errors
    const [fieldError, setFieldError] = useState(null);
    const errorName = fieldError && fieldError.name;
    const errorEmail = fieldError && fieldError.email;
    const errorPass = fieldError && fieldError.password;
    // end detecting field errors

    // Redux
    const { bizInfo, isModalRegisterOpen, isUserAuthenticated } = useStoreState(
        (state) => ({
            isModalRegisterOpen: state.modalReducers.cases.isModalRegisterOpen,
            isUserAuthenticated: state.authReducer.cases.isUserAuthenticated,
            bizInfo: state.adminReducer.cases.businessInfo,
        })
    );

    // This component is running before fetching bizInfo, that's why this condition until further info
    const bizName = bizInfo && bizInfo.bizName;
    const bizSlogon = bizInfo && bizInfo.bizSlogon;
    const bizWebsite = bizInfo && bizInfo.bizWebsite;
    const bizWhatsapp = bizInfo && bizInfo.bizWhatsapp;

    const dispatch = useStoreDispatch();
    // End Redux

    useEffect(() => {
        if (isModalRegisterOpen && isUserAuthenticated) {
            closeModal(dispatch, isModalRegisterOpen);
        }
    }, [isUserAuthenticated, isModalRegisterOpen, dispatch]);

    const sendEmail = (userId) => {
        const dataEmail = {
            name,
            email,
            bizName,
            bizSlogon,
            bizWebsite,
            bizWhatsapp,
        };
        sendWelcomeConfirmEmail(dataEmail, userId).then((res) => {
            if (res.status !== 200)
                return showSnackbar(dispatch, res.data.msg, "error");
            setTimeout(
                () => showSnackbar(dispatch, res.data.msg, "warning", 3000),
                4000
            );
        });
    };

    const clearData = () => {
        clearForm(setData, data);
        setFieldError(null);
    };

    const registerThisUser = (e) => {
        // e.preventDefault();

        const newUser = {
            name,
            email,
            password,
            reCaptchaToken,
        };
        // Attempt to register
        registerEmail(dispatch, newUser).then((res) => {
            if (res.status !== 200) {
                showSnackbar(dispatch, res.data.msg, "error", 6000);
                // detect field errors
                const thisModalFields = Object.keys(data);
                const foundObjError = detectErrorField(
                    res.data.msg,
                    thisModalFields
                );
                setFieldError(foundObjError);
                return;
            }

            showSnackbar(dispatch, res.data.msg, "success", 4000);
            sendEmail(res.data.authUserId);
            clearData();
        });
    };

    // render
    const showHeader = () => (
        <Fragment>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <img
                    width="90"
                    height="90"
                    src="img/babadoo-logo_no-slogon.png"
                    alt="loja babadoo"
                />
            </div>
            <DialogTitle id="form-dialog-title" className="text-center">
                CADASTRO
                <br />
                Registre sua Conta
                <br />
                <span className="text-normal">
                    ou faça{" "}
                    <button
                        style={{
                            padding: "2px 5px",
                            borderRadius: "20px",
                            backgroundColor: "var(--mainYellow)",
                        }}
                        onClick={() => showModalLogin(dispatch)}
                    >
                        Seu Login
                    </button>
                </span>
            </DialogTitle>
        </Fragment>
    );

    // Form
    const showReCaptcha = () => (
        <div className="container-center mt-3">
            <ReCaptchaCheckbox setToken={setData} data={data} />
        </div>
    );

    const showActionButtons = () => (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                margin: "5px 5px 15px",
            }}
        >
            <ButtonMulti onClick={() => closeModal(dispatch)} variant="link">
                Voltar
            </ButtonMulti>
            <ButtonMulti
                onClick={() => {
                    registerThisUser();
                    setTimeout(() => readUserList(dispatch), 3000);
                    showSnackbar(dispatch, "Registrando...");
                }}
                iconFontAwesome="fas fa-paper-plane"
            >
                Criar Conta
            </ButtonMulti>
        </div>
    );

    const showForm = () => (
        // n1
        <form style={{ margin: "auto", width: "80%" }}>
            <TextField
                autoFocus
                onChange={handleChange(setData, data)}
                error={!!errorName}
                margin="dense"
                id="name"
                name="name"
                type="name"
                label="Nome"
                fullWidth
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <AccountCircle />
                        </InputAdornment>
                    ),
                }}
            />
            <TextField
                margin="dense"
                onChange={handleChange(setData, data)}
                error={!!errorEmail}
                name="email"
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
            <ToggleVisibilityPassword
                onChange={handleChange(setData, data)}
                data={data}
                setData={setData}
                error={errorPass}
                showForgotPass={false}
            />
            {showReCaptcha()}
            {showActionButtons()}
        </form>
    );

    return (
        <Dialog open={isModalRegisterOpen} aria-labelledby="form-dialog-title">
            {showHeader()}
            {showForm()}
        </Dialog>
    );
}

/* COMMENTS
n1: LESSON: never put onChange as a standlone prop to check each field in a form. If you are using CheckBox, can conflict and leads to unexpected results.
*/
