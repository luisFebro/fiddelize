import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import handleChange from "../../../utils/form/use-state/handleChange";
import { handleNextField } from "../../../utils/form/kit";
import cpfMaskBr from "../../../utils/validation/masks/cpfMaskBr";
import InputAdornment from "@material-ui/core/InputAdornment";
import EmailIcon from "@material-ui/icons/Email";
import MoneyIcon from "@material-ui/icons/Money";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonMulti, {
    faStyle,
} from "../../../components/buttons/material-ui/ButtonMulti";
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

export default function AsyncPasswordRecoverContent() {
    const [data, setData] = useState({
        cpf: "",
        email: "",
    });
    const { cpf, email } = data;

    const styles = getStyles();

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
            onBlur={() => {
                // setFieldError(null);
                // setActionBtnDisabled(false);
            }}
        >
            <div id="field1" className="mt-3">
                CPF
                <TextField
                    required
                    margin="dense"
                    onChange={handleChange(setData, data)}
                    error={null}
                    name="cpf"
                    variant="standard"
                    onKeyPress={(e) => {
                        // Not working
                        handleNextField(e, "field1", {
                            callback: () => {
                                setData({ ...data, cpf: cpfMaskBr(cpf) });
                            },
                        });
                    }}
                    onBlur={(e) => {
                        handleNextField(e, "field1", {
                            callback: () => {
                                setData({ ...data, cpf: cpfMaskBr(cpf) });
                            },
                        });
                    }}
                    value={cpf}
                    type="tel"
                    autoComplete="off"
                    helperText="Digite apenas números."
                    FormHelperTextProps={{ style: styles.helperFromField }}
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

    const handlePassRecover = () => {};

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

    return (
        <section>
            {showTitle()}
            <p className="my-5 text-purple text-normal font-weight-bold mx-3">
                Precisamos confirmar algumas informações. Beleza?
            </p>
            {showForm()}
            {showCTA()}
        </section>
    );
}
