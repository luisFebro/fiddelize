import { Fragment } from "react";
import removeImgFormat from "utils/biz/removeImgFormat";
import TextField from "@material-ui/core/TextField";
import handleChange from "utils/form/use-state/handleChange";
import InputAdornment from "@material-ui/core/InputAdornment";
import EmailIcon from "@material-ui/icons/Email";
import validateEmail from "utils/validation/validateEmail";
import showToast from "components/toasts";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { setItems } from "init/lStorage";

const getStyles = () => ({
    fieldForm: {
        backgroundColor: "var(--mainWhite)",
        color: "var(--themeP)",
        // zIndex: 2000,
        font: "normal 1em Poppins, sans-serif",
    },
});

export default function CustomerAccessForm({ closeModal, data, setData }) {
    const { email, errorEmail, bizLogo, sColor, bizLinkName } = data;

    const styles = getStyles();

    const { newImg: thisbizLogo, width, height } = removeImgFormat(bizLogo);

    const switchError = (error) => {
        setData((prev) => ({ ...prev, ...error }));
    };

    const handleAccess = () => {
        if (!email)
            return showToast("Informe email para acesso", { type: "error" });

        if (!validateEmail(email))
            return showToast("Formato de e-mail inválido.", { type: "error" });

        setItems("global", {
            digitalMenuLogin: {
                [bizLinkName]: email,
            },
        });
        // save db
        closeModal();
    };

    const showLogo = () => (
        <div className="my-5 text-purple animated fadeInUp">
            <img
                src={thisbizLogo}
                className="img-center shadow-babadoo"
                width={width}
                height={height}
                title="logo"
                alt="logo"
            />
            <h1 className="font-weight-bold text-subtitle text-center">
                Acesso
            </h1>
        </div>
    );

    return (
        <Fragment>
            <form
                style={{ margin: "auto", width: "90%" }}
                className="text-p text-normal"
                onFocus={() =>
                    switchError({
                        errorEmail: false,
                    })
                }
            >
                {showLogo()}
                <div id="field1" className="">
                    Seu email:
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        onChange={handleChange(setData, data)}
                        error={errorEmail}
                        name="email"
                        variant="standard"
                        value={email}
                        type="text"
                        autoComplete="off"
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailIcon />
                                </InputAdornment>
                            ),
                            style: styles.fieldForm,
                            id: "value2",
                        }}
                    />
                </div>
            </form>
            <div className="my-4 mx-3 container-center">
                <ButtonFab
                    size="medium"
                    title="Acessar"
                    width="100%"
                    position="relative"
                    onClick={handleAccess}
                    backgroundColor={`var(--themeSDark--${sColor})`}
                    variant="extended"
                />
            </div>
        </Fragment>
    );
}

/* future email markgint opt-in

<CheckBoxForm
    text="Me avise das novidades - máximo 1 vez por semana"
    setIsBoxChecked={handleChecked}
    defaultState
/>

 */
