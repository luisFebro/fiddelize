import { useState } from "react";
import TextField from "@material-ui/core/TextField";
import handleChange from "utils/form/use-state/handleChange";
import { handleNextField } from "utils/form/kit";
import AccountCircle from "@material-ui/icons/AccountCircle";
import InputAdornment from "@material-ui/core/InputAdornment";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import showToast from "components/toasts";
import { updateUser } from "api/frequent";

const isSmall = window.Helper.isSmallScreen();

export default function CustomDataForm({ userId, role = "cliente" }) {
    const [actionBtnDisabled, setActionBtnDisabled] = useState(false);
    const [data, setData] = useState({
        name: "",
        gender: "escolha opção:",
    });
    const { name, gender } = data;

    const handleCustomDataForm = () => {
        if (!userId)
            return showToast(
                "Não foi possível processar o id da sua conta. Tente sair e entrar novamente.",
                { type: "error" }
            );
        if (!name) return showToast("Informe seu nome", { type: "error" });
        // if(name && name.length < 8) return showToast("Nome precisa de pelo menos 8 characteres. Informe um sobrenome.", { type: "error"});
        if (gender === "escolha opção:")
            return showToast("Informe forma de tratamento.", { type: "error" });

        setActionBtnDisabled(true);
        const dataToSend = {
            name,
            gender,
        };

        updateUser(userId, role, dataToSend)
            .then(() => {
                showToast("Um momento. Atualizando seu app...", { dur: 15000 });
                window.location.href = "/app";
            })
            .catch((err) => showToast("Ocorreu um erro. Tente novamente."));
    };

    const showCTA = () => (
        <div className="my-4 mx-5">
            <ButtonFab
                title="Iniciar"
                width="100%"
                disabled={!!actionBtnDisabled}
                backgroundColor="var(--themeSDark)"
                onClick={handleCustomDataForm}
                position="relative"
                variant="extended"
                size="large"
            />
        </div>
    );

    const showForm = () => (
        <form
            style={{ margin: "auto", width: "90%" }}
            className="text-p text-normal"
            onBlur={() => {
                // setFieldError(null);
                setActionBtnDisabled(false);
            }}
        >
            <div id="field1" className="mt-3">
                Qual é o seu nome?
                <TextField
                    required
                    onChange={handleChange(setData, data)}
                    error={false} // !!errorName
                    variant="outlined"
                    margin="dense"
                    id="name"
                    name="name"
                    onKeyPress={(e) => {
                        handleNextField(e, "field1", {
                            callback: () =>
                                setData({ ...data, name: name && name.cap() }),
                        });
                    }}
                    onBlur={(e) => {
                        handleNextField(e, "field1", {
                            event: "onBlur",
                            callback: () =>
                                setData({ ...data, name: name.cap() }),
                        });
                    }}
                    autoComplete="off"
                    value={name}
                    type="text"
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AccountCircle />
                            </InputAdornment>
                        ),
                        style: {
                            backgroundColor: "var(--mainWhite)",
                            // zIndex: 2000,
                            font: "normal 1em Poppins, sans-serif",
                        },
                    }}
                />
            </div>
            <div id="field2" className="my-3">
                Selecione forma tratamento:
                <Select
                    margin="dense"
                    labelId="gender"
                    id="value6"
                    onChange={handleChange(setData, data)}
                    name="gender"
                    fullWidth
                    value={gender}
                    variant="outlined"
                    error={false} // false
                    style={{ backgroundColor: "var(--mainWhite)" }}
                >
                    <MenuItem value={gender}>
                        <span
                            className="text-p text-normal"
                            style={{
                                fontSize: isSmall ? "1.1em" : "",
                                fontFamily: "Poppins, sans-serif",
                            }}
                        >
                            escolha opção:
                        </span>
                    </MenuItem>
                    <MenuItem value="Ela">Ela</MenuItem>
                    <MenuItem value="Ele">Ele</MenuItem>
                </Select>
            </div>
            {showCTA()}
        </form>
    );

    return (
        <section className="text-purple">
            <h2 className="text-center text-subtitle font-weight-bold my-4">
                Antes de começar...
            </h2>
            {showForm()}
        </section>
    );
}
