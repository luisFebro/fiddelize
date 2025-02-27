import { useState, useEffect } from "react";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import showToast from "components/toasts";
import handleChange from "utils/form/use-state/handleChange";
import RadiusBtn from "components/buttons/RadiusBtn";
import EditButton from "components/buttons/EditButton";
import { updateUser } from "api/frequent";
import useData from "init";
import getVar from "init/var";

const isSmall = window.Helper.isSmallScreen();

const getStyles = () => ({
    fieldForm: {
        backgroundColor: "var(--mainWhite)",
        color: "var(--themeP)",
        padding: "10px 5px",
        // zIndex: 2000,
        font: "normal 1em Poppins, sans-serif",
    },
    helperFromField: {
        color: "grey",
        fontFamily: "Poppins, sans-serif",
        fontSize: isSmall ? ".8em" : ".6em",
    },
});

export default function PixKeyRequest() {
    const [data, setData] = useState({
        pix: "",
        alreadyHasPix: false,
        loadingPix: true,
    });
    const { pix, alreadyHasPix, loadingPix } = data;

    const { userId } = useData();

    useEffect(() => {
        (async () => {
            const dbPix = await getVar("pixKey", "user");
            if (!dbPix)
                return setData((prev) => ({ ...prev, loadingPix: false }));

            return setData((prev) => ({
                ...prev,
                pix: dbPix,
                alreadyHasPix: true,
                loadingPix: false,
            }));
        })();
    }, []);

    const styles = getStyles();

    const handleSubmitPix = () => {
        (async () => {
            setData({ ...data, alreadyHasPix: true });
            const body = {
                "bizTeamData.pixKey": pix,
            };
            // LESSON: if put is not working with data, probably you are missing to declare method put.
            await updateUser(userId, "nucleo-equipe", body);

            showToast("Pix registrado!", { type: "success" });
        })();
    };

    const handleEdit = () => {
        setData({ ...data, alreadyHasPix: false });
    };

    const showCTA = () => (
        <section className="mt-3 container-center animated fadeInUp">
            <RadiusBtn
                title="salvar Pix"
                onClick={handleSubmitPix}
                backgroundColor="var(--themeSDark)"
            />
        </section>
    );

    const ctaOn = pix && !alreadyHasPix;
    const showPixRegisterForm = () => (
        <section className="my-5 text-purple text-normal">
            Insira aqui sua <strong>Chave Pix:</strong>
            <TextField
                required
                margin="dense"
                onChange={handleChange(setData, data)}
                error={null}
                name="pix"
                value={pix}
                variant="standard"
                type="text"
                autoComplete="off"
                helperText={
                    pix
                        ? ""
                        : "será usada para transferência de ganhos por transações com Pix"
                }
                FormHelperTextProps={{ style: styles.helperFromField }}
                fullWidth
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <VpnKeyIcon />
                        </InputAdornment>
                    ),
                    style: styles.fieldForm,
                    id: "value2",
                }}
            />
            {ctaOn && showCTA()}
        </section>
    );

    const showPixEdit = () => (
        <section className="text-break py-3 text-pill position-relative my-5 text-normal text-center text-purple">
            <h2 className="text-center text-white font-weight-bold">
                Chave Pix:
            </h2>
            {pix}
            <div
                className="position-absolute"
                style={{
                    top: "-25px",
                    right: "-15px",
                }}
            >
                <EditButton onClick={handleEdit} zIndex=" " />
            </div>
        </section>
    );

    if (loadingPix) {
        return (
            <section className="my-5 text-grey text-center font-weight-bold text-normal">
                Carregando Pix...
            </section>
        );
    }

    return (
        <section>
            {!alreadyHasPix ? showPixRegisterForm() : showPixEdit()}
        </section>
    );
}
