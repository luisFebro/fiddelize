import React, { useEffect, useState } from "react";
import ButtonMulti, {
    faStyle,
} from "../../../../components/buttons/material-ui/ButtonMulti";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextField from "@material-ui/core/TextField";
import handleChange from "../../../../utils/form/use-state/handleChange";
// import DateWithIcon from '../../../../components/date-time/DateWithIcon';
import PropTypes from "prop-types";
import CreatedAtBr from "../../CreatedAtBr";
import { updateUser, readUser } from "../../../../redux/actions/userActions";
import { showSnackbar } from "../../../../redux/actions/snackbarActions";
import { useStoreDispatch } from "easy-peasy";
import isValidName from "../../../../utils/validation/isValidName";
import phoneMaskBr from "../../../../utils/validation/masks/phoneMaskBr";
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
        maritalStatus: "",
    });
    const [error, setError] = useState("");

    useEffect(() => {
        readUser(dispatch, userData._id, { role: "cliente" }).then((res) => {
            if (res.status !== 200)
                return showSnackbar(dispatch, res.data.msg, "error");
            setData({
                name: res.data.name && res.data.name.cap(),
                cpf: res.data.cpf,
                birthday: res.data.birthday,
                email: res.data.email,
                phone: res.data.phone,
                maritalStatus: res.data.maritalStatus,
            });
        });
    }, []);

    const dispatch = useStoreDispatch();

    const {
        name,
        cpf,
        birthday,
        email,
        phone,
        maritalStatus,
        bizWhatsapp,
    } = data;

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
        if (!isValidName(name))
            return showSnackbar(
                dispatch,
                "O nome deve conter um sobrenome",
                "error",
                4000,
                setError("name")
            );
        if (!validatePhone(phone))
            return showSnackbar(
                dispatch,
                "Formato telefone inválido. Digita o número com DDD ex: (95) 97777-9999",
                "error",
                4000,
                setError("phone")
            );
        if (!validateEmail(email))
            return showSnackbar(
                dispatch,
                "Email inválido. Verifique caracteres e tente novamente",
                "error",
                4000,
                setError("email")
            );

        const dataToSend = { ...data };
        updateUser(dispatch, dataToSend, userData._id).then((res) => {
            if (res.status !== 200)
                return showSnackbar(dispatch, res.data.msg, "error");
            showSnackbar(dispatch, "Seu perfil foi atualizado!", "success");
        });
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
                <div className={`mt-4 margin-auto-95 text-normal`}>
                    <p className="text-shadow">Nome</p>
                    <TextField
                        InputProps={{ style: styles.fieldForm }}
                        variant="outlined"
                        onChange={handleChange(setData, data)}
                        fullWidth
                        error={error === "name" ? true : false}
                        autoComplete="off"
                        type="text"
                        name="name"
                        value={name}
                    />
                </div>
                <div className={`mt-4 margin-auto-95 text-normal`}>
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
                <div className={`mt-4 margin-auto-95 text-normal`}>
                    <p className="text-shadow">Contato</p>
                    <TextField
                        InputProps={{ style: styles.fieldForm }}
                        variant="outlined"
                        onChange={handleChange(setData, data)}
                        onBlur={() =>
                            setData({ ...data, phone: phoneMaskBr(phone) })
                        }
                        error={error === "phone" ? true : false}
                        onKeyPress={(e) =>
                            isKeyPressed(e, "Enter") &&
                            setData({ ...data, phone: phoneMaskBr(phone) })
                        }
                        autoComplete="off"
                        name="phone"
                        value={phone}
                        type="tel"
                        fullWidth
                    />
                </div>
                <div className={`mt-4 margin-auto-95 text-normal`}>
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
                <div className={`mt-4 margin-auto-95 text-normal`}>
                    <p className="text-shadow">Email</p>
                    <TextField
                        InputProps={{ style: styles.fieldForm }}
                        variant="outlined"
                        onChange={handleChange(setData, data)}
                        error={error === "email" ? true : false}
                        autoComplete="off"
                        type="text"
                        name="email"
                        value={email}
                        fullWidth
                    />
                </div>
                <div className={`mt-4 margin-auto-95 text-normal`}>
                    <p className="text-shadow">Estado Civil</p>
                    <TextField
                        InputProps={{ style: styles.fieldForm }}
                        variant="outlined"
                        onChange={handleChange(setData, data)}
                        autoComplete="off"
                        name="maritalStatus"
                        value={maritalStatus}
                        fullWidth
                    />
                </div>
                <div className={`mt-3`}>
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
