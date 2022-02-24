import { Fragment, useEffect } from "react";
import removeImgFormat from "utils/biz/removeImgFormat";
import TextField from "@material-ui/core/TextField";
import handleChange from "utils/form/use-state/handleChange";
import InputAdornment from "@material-ui/core/InputAdornment";
import EmailIcon from "@material-ui/icons/Email";
import validateEmail from "utils/validation/validateEmail";
import showToast from "components/toasts";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import useContext from "context";
import { setItems } from "init/lStorage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonMulti from "components/buttons/material-ui/ButtonMulti";

const getStyles = () => ({
    fieldForm: {
        backgroundColor: "var(--mainWhite)",
        color: "var(--themeP)",
        // zIndex: 2000,
        font: "normal 1em Poppins, sans-serif",
    },
});

export default function CustomerAccessForm({ closeModal }) {
    const {
        bizName,
        adminId,
        socket,
        needBenefit = false,
        loginData,
        bizLogo,
        pColor,
        sColor,
        bizLinkName,
        setEmailData,
        emailData,
    } = useContext();
    const { email, errorEmail, digitalMenuSkipLogin } = loginData;

    const styles = getStyles();

    useEffect(() => {
        // handle skipLogin which returns true when visitor opens the modal after skipping
        if (email === true) {
            setEmailData((prev) => ({
                ...prev,
                email: "",
            }));
        }
    }, [email]);

    const { newImg: thisbizLogo, width, height } = removeImgFormat(bizLogo);

    const switchError = (error) => {
        setEmailData((prev) => ({ ...prev, ...error }));
    };

    const handleAccess = () => {
        if (!email)
            return showToast("Você precisa de um email para acessar", {
                type: "error",
            });

        if (!validateEmail(email))
            return showToast("Formato de e-mail inválido.", { type: "error" });

        // success

        setItems("global", {
            digitalMenuLogin: {
                [bizLinkName]: email,
            },
            // if toggle when false, it will prevent access from first-time users
            digitalMenuSkipLogin: {
                [bizLinkName]:
                    digitalMenuSkipLogin === true ? false : undefined,
            },
        });
        // save db
        if (socket) {
            socket.emit("customerAccess", { bizName, adminId, email });
            setEmailData((prev) => ({
                ...prev,
                loginOk: true,
            }));

            // need reload to show email
            // if(digitalMenuSkipLogin) {
            //     window.location.reload();
            //     showToast("Iniciando sessão...");
            // }
            closeModal();
        }
    };

    const showLogo = () => (
        <div className="mt-1 mb-2 text-purple">
            <img
                src={thisbizLogo}
                className="img-center shadow-babadoo"
                width={width}
                height={height}
                title="logo"
                alt="logo"
            />
            <h1 className="font-weight-bold text-subtitle text-center">
                Acesso Menu
            </h1>
        </div>
    );

    const showAdvantagesArea = () => (
        <section className="advantages-area mb-3">
            <p className="m-0 font-site text-em-0-8 text-left text-white text-shadow">
                <FontAwesomeIcon icon="bell" /> Seja notificado do seu pedido!
            </p>
            {needBenefit && (
                <p className="font-site text-em-0-8 text-left text-white text-shadow">
                    <FontAwesomeIcon icon="trophy" /> Acumule 100 pontos nos
                    pedidos e ganhe desconto de R$ 10
                </p>
            )}
            <style jsx>
                {`
                    .advantages-area {
                        background: var(--themeP--${pColor});
                        padding: 10px;
                        border-radius: 15px;
                    }
                `}
            </style>
        </section>
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
                {showAdvantagesArea()}
                <div id="field1" className="">
                    Seu email:
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        onChange={handleChange(setEmailData, emailData)}
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
            <div className="mt-2 mb-1 mx-3 container-center">
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
            <div className="mb-1 container-center">
                <ButtonMulti
                    title="Pular e acessar menu"
                    onClick={() => {
                        closeModal();
                        setItems("global", {
                            digitalMenuSkipLogin: {
                                [bizLinkName]: true,
                            },
                        });
                    }}
                    variant="link"
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
