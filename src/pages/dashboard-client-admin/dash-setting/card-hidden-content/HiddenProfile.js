import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
import ButtonMulti, {
    faStyle,
} from "../../../../components/buttons/material-ui/ButtonMulti";
import handleChange from "../../../../utils/form/use-state/handleChange";
import CreatedAtBr from "../../CreatedAtBr";
import { readUser, updateUser } from "api/frequent";
import showToast from "../../../../components/toasts";
import isValidName from "../../../../utils/validation/isValidName";
import autoPhoneMask from "../../../../utils/validation/masks/autoPhoneMask";
import isKeyPressed from "../../../../utils/event/isKeyPressed";
import validatePhone from "../../../../utils/validation/validatePhone";
import validateEmail from "../../../../utils/validation/validateEmail";

const isSmall = window.Helper.isSmallScreen();

HiddenProfile.propTypes = {
    userData: PropTypes.object,
};

export default function HiddenProfile({ userData }) {
    const [data, setData] = useState({
        name: userData.name,
        cpf: "",
        birthday: "",
        email: "",
        phone: "",
        gender: "",
    });

    const { name, cpf, birthday, email, phone, gender } = data;
    const phoneValue = autoPhoneMask(phone);

    const [error, setError] = useState("");

    useEffect(() => {
        (async () => {
            const select = "name cpf birthday email phone gender";
            const dataUser = await readUser(
                userData.userId,
                "cliente-admin",
                select
            );

            setData((prev) => ({
                ...prev,
                name: dataUser.name.cap(),
                cpf: dataUser.cpf,
                birthday: dataUser.birthday,
                email: dataUser.email,
                phone: dataUser.phone,
                gender: dataUser.gender,
            }));
        })();
    }, []);

    const styles = {
        form: {
            maxWidth: "350px",
            background: "var(--themeSDark)",
            borderRadius: "10px",
            padding: "25px",
        },
        fieldForm: {
            backgroundColor: "var(--mainWhite)",
            color: "var(--mainPurple)",
            zIndex: 2000,
            font: "normal 1em Poppins, sans-serif",
        },
        helperFromField: {
            color: "grey",
            fontFamily: "Poppins, sans-serif",
            fontSize: isSmall ? ".8em" : ".6em",
        },
    };

    const sendDataBackend = () => {
        if (!isValidName(name)) {
            showToast("O nome deve conter um sobrenome", { type: "error" });
            return setError("name");
        }

        if (!validatePhone(phone))
            return showToast(
                "Formato telefone inválido. Digita o número com DDD ex: (95) 97777-9999",
                { type: "error", callback: () => setError("phone") }
            );
        if (!validateEmail(email))
            return showToast(
                "Email inválido. Verifique caracteres e tente novamente",
                { type: "error", callback: () => setError("email") }
            );

        const dataToSend = { ...data };
        updateUser(userData._id, "cliente-admin", dataToSend)
            .then(() =>
                showToast("Seu perfil foi atualizado!", { type: "success" })
            )
            .catch((err) => showToast(err.response, { type: "error" }));
    };

    const showButtonAction = () => (
        <div className="container-center" style={{ marginTop: "20px" }}>
            <ButtonMulti
                title="Atualizar"
                onClick={sendDataBackend}
                color="var(--mainWhite)"
                backgroundColor="var(--themeP)"
                backColorOnHover="var(--themeP)"
                iconFontAwesome={
                    <FontAwesomeIcon icon="sync-alt" style={faStyle} />
                }
                textTransform="uppercase"
            />
        </div>
    );

    const showForm = () => (
        <div className="container-center mt-5">
            <form
                className="animated zoomIn fast shadow-elevation text-white font-weight-bold"
                onBlur={() => setError("")}
                style={styles.form}
            >
                <p className="text-shadow text-subtitle font-weight-bold">
                    Atualize informações de Perfil
                </p>
                <div className="mt-4 margin-auto-95 text-normal">
                    <p className="text-shadow">Nome</p>
                    <TextField
                        InputProps={{ style: styles.fieldForm }}
                        variant="outlined"
                        onChange={handleChange(setData, data)}
                        fullWidth
                        error={error === "name"}
                        autoComplete="off"
                        type="text"
                        name="name"
                        value={name}
                    />
                </div>
                <div className="mt-4 margin-auto-95 text-normal">
                    <p className="text-shadow">CPF</p>
                    <TextField
                        InputProps={{
                            style: { ...styles.fieldForm, color: "grey" },
                        }}
                        variant="outlined"
                        fullWidth
                        autoComplete="off"
                        // helperText="CPF não pode ser altarado."
                        // FormHelperTextProps={{ style: styles.helperFromField }}
                        name="cpf"
                        value={cpf}
                        disabled
                    />
                </div>
                <div className="mt-4 margin-auto-95 text-normal">
                    <p className="text-shadow">Contato</p>
                    <TextField
                        InputProps={{ style: styles.fieldForm }}
                        variant="outlined"
                        onChange={handleChange(setData, data)}
                        onBlur={() =>
                            setData({ ...data, phone: autoPhoneMask(phone) })
                        }
                        error={error === "phone"}
                        onKeyPress={(e) =>
                            isKeyPressed(e, "Enter") &&
                            setData({ ...data, phone: autoPhoneMask(phone) })
                        }
                        autoComplete="off"
                        name="phone"
                        value={phoneValue}
                        type="tel"
                        fullWidth
                    />
                </div>
                <div className="mt-4 margin-auto-95 text-normal">
                    <p className="text-shadow">Data de Nascimento</p>
                    <TextField
                        InputProps={{ style: styles.fieldForm }}
                        variant="outlined"
                        onChange={handleChange(setData, data)}
                        autoComplete="off"
                        fullWidth
                        name="birthday"
                        value={birthday}
                    />
                </div>
                <div className="mt-4 margin-auto-95 text-normal">
                    <p className="text-shadow">Email</p>
                    <TextField
                        InputProps={{ style: styles.fieldForm }}
                        variant="outlined"
                        onChange={handleChange(setData, data)}
                        error={error === "email"}
                        autoComplete="off"
                        type="text"
                        name="email"
                        value={email}
                        fullWidth
                    />
                </div>
                <div className="d-none mt-4 margin-auto-95 text-normal">
                    <p className="text-shadow">Forma de Tratamento</p>
                    <TextField
                        InputProps={{ style: styles.fieldForm }}
                        variant="outlined"
                        onChange={handleChange(setData, data)}
                        autoComplete="off"
                        name="gender"
                        value={gender}
                        fullWidth
                    />
                </div>
                <div className="mt-3">
                    <CreatedAtBr
                        createdAt={userData.createdAt}
                        needTextShadow
                    />
                </div>
                {showButtonAction()}
            </form>
        </div>
    );

    return (
        <div className="hidden-content--root text-normal mt-4">
            {showForm()}
        </div>
    );
}

/* ARCHIVES
wrong date because lack of time recording in db
<DateWithIcon
    date={userData.updatedAt}
    msgIfNotValidDate="Nenhuma alteração."
/>
*/
