import { Fragment, useState } from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import EmailIcon from "@material-ui/icons/Email";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import handleChange from "utils/form/use-state/handleChange";
import ButtonMulti, {
    faStyle,
} from "components/buttons/material-ui/ButtonMulti";
import getAPI, { forgotPasswordRequest } from "api";
import useData from "init";
import showToast from "components/toasts";

const isSmall = window.Helper.isSmallScreen();

const getStyles = () => ({
    fieldForm: {
        backgroundColor: "var(--mainWhite)",
        color: "var(--themeP)",
        // zIndex: 2000,
        font: "normal 1em Poppins, sans-serif",
    },
    helperFromField: {
        color: "grey",
        fontFamily: "Poppins, sans-serif",
        fontSize: isSmall ? ".8em" : ".6em",
    },
});

export default function AsyncPasswordRecoverContent({ role }) {
    const [data, setData] = useState({
        email: "",
        visibleForm: true,
    });
    const { email, visibleForm } = data;

    const styles = getStyles();

    const [userId] = useData(["userId"]);

    const showTitle = () => (
        <p
            className="text-nowrap position-relative text-subtitle text-purple text-center font-weight-bold"
            style={{ margin: "0 15px", top: "15px" }}
        >
            Redefinir Senha
        </p>
    );

    const showForm = () => (
        <form
            style={{ margin: "auto", width: "90%" }}
            className="text-p text-normal"
            onBlur={null}
        >
            <div id="field2" className="mt-3">
                Email
                <TextField
                    required
                    margin="dense"
                    onChange={handleChange(setData, data)}
                    onKeyPress={null}
                    onBlur={null}
                    error={null}
                    name="email"
                    variant="standard"
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
        </form>
    );

    const handlePassRecover = () => {
        (async () => {
            if (!email)
                return showToast("Informe email válido.", { type: "error" });

            const body = {
                userId,
                email,
                role,
            };
            const success = await getAPI({
                method: "post",
                body,
                url: forgotPasswordRequest(),
                errMsg: true,
            });
            if (!success) return null;

            if (!visibleForm)
                showToast("Email foi enviado novamente.", {
                    type: "success",
                });

            setData((prev) => ({ ...prev, visibleForm: false }));
        })();
    };

    const showCTA = () => (
        <div className="my-3 container-center">
            <ButtonMulti
                onClick={handlePassRecover}
                disabled={false}
                title="Solicitar"
                color="var(--mainWhite)"
                backgroundColor="var(--themeSDark)"
                backColorOnHover="var(--themeSDark)"
                iconFontAwesome={
                    <FontAwesomeIcon icon="paper-plane" style={faStyle} />
                }
            />
        </div>
    );

    const showPendingContent = () => (
        <section>
            <p className="my-5 text-purple text-normal font-weight-bold mx-3">
                Precisamos confirmar algumas informações. Beleza?
            </p>
            {showForm()}
            {showCTA()}
        </section>
    );

    const showSuccessfulContent = () => (
        <section>
            <p className="animated fadeInUp my-5 text-purple text-normal font-weight-bold mx-3">
                <span className="d-block text-center text-subtitle font-weight-bold">
                    PRONTO!
                </span>
                <br />
                Foi enviado instruções para seu email.
                <br />
                <br />
                Caso não tenha chegado, verifique na sua caixa de spam ou
                <span className="text-link" onClick={() => handlePassRecover()}>
                    {" "}
                    envie novamente aqui
                </span>
            </p>
        </section>
    );

    return (
        <Fragment>
            {showTitle()}
            {visibleForm ? showPendingContent() : showSuccessfulContent()}
        </Fragment>
    );
}
