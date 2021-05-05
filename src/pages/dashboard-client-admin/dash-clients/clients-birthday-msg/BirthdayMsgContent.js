import { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import getAPI, { updateUser } from "api";
import useAPI, { readUser } from "api/useAPI";
import { useBizData } from "init";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import showToast from "components/toasts";
import useData from "init";
import handleChange from "utils/form/use-state/handleChange";
import "./_BirthdayMsgContent.scss";

const getStyles = () => ({
    fieldFormValue: {
        backgroundColor: "var(--mainWhite)",
        color: "var(--themeP)",
        fontSize: "20px",
        fontFamily: "var(--mainFont)",
    },
});

export default function BirthdayMsgContent() {
    const [edit, setEdit] = useState(false);

    const { bizName } = useBizData();
    const [birthdayMsg, setBirthdayMsg] = useState(
        `a ${bizName} está passando aqui neste dia especial para te desejar um feliz aniversário com mais saúde e conquistas!`
    );

    const role = "cliente-admin";

    const styles = getStyles();
    const [firstName, userId] = useData(["firstName", "userId"]);

    const { data, loading } = useAPI({
        url: readUser(userId, role),
        trigger: userId !== "...",
        params: {
            select: "clientAdminData.birthdayMsg",
            clientAdminRequest: true,
        },
    });

    useEffect(() => {
        const msg = data && data.birthdayMsg;
        if (msg) {
            setBirthdayMsg(msg);
        }
    }, [data]);

    const showTitle = () => (
        <div className="my-4">
            <p className="text-subtitle text-purple text-center font-weight-bold">
                Mensagem de
                <br />
                Aniversário para clientes
            </p>
        </div>
    );

    const handleUpdateMsg = () => {
        if (userId === "...") return;

        (async () => {
            await getAPI({
                method: "put",
                url: updateUser(userId, role),
                body: {
                    "clientAdminData.birthdayMsg": birthdayMsg,
                },
            }).catch((err) => {
                showToast("Ocorreu um erro ao atualizar", { type: "error" });
                console.log(`ERROR: ${err}`);
            });

            showToast(
                `${firstName}, mensagem para clientes de aniversário atualizada!`,
                { type: "success" }
            );
            setEdit(false);
        })();
    };

    const MAX_LEN = 300;
    const showEditField = () => (
        <section className="text-normal">
            <TextField
                multiline
                placeholder=""
                rows={8}
                InputProps={{
                    style: styles.fieldFormValue,
                }}
                // eslint-disable-next-line
                inputProps={{
                    maxLength: MAX_LEN,
                }}
                name="birthdayMsg"
                value={birthdayMsg}
                onChange={(e) => handleChange(setBirthdayMsg)(e)}
                variant="outlined"
                fullWidth
            />
            <div className="mb-3 position-relative text-white text-left">
                <span className="font-site text-em-0-7 font-weight-bold text-shadow">
                    {birthdayMsg.length}/{MAX_LEN} characteres
                </span>
            </div>
            <div className="my-3 container-center">
                <ButtonFab
                    title="Atualizar Mensagem"
                    position="relative"
                    onClick={handleUpdateMsg}
                    color="white"
                    backgroundColor="var(--themeSDark--default)"
                    variant="extended"
                    size="large"
                />
            </div>
        </section>
    );

    const showMsg = () => (
        <section className="text-normal">
            {loading ? (
                <p className="my-5 text-center">Carregando...</p>
            ) : (
                birthdayMsg
            )}
            <div className="mx-3 my-3 container-center">
                <ButtonFab
                    title="Editar"
                    width="100%"
                    position="relative"
                    onClick={() => setEdit(true)}
                    color="white"
                    backgroundColor="var(--themeSDark--default)"
                    variant="extended"
                    size="large"
                />
            </div>
        </section>
    );

    const showNotes = () => (
        <div className="mx-3 text-purple mb-5">
            <p className="m-0 text-normal">Nota:</p>
            <p className="text-small font-weight-bold">
                O nome do cliente é incluído de forma automática e a mensagem
                fica neste padrão: "Ei [NOME CLIENTE], [SUA MENSAGEM DE
                ANIVERSÁRIO]."
            </p>
        </div>
    );

    return (
        <section>
            {showTitle()}
            <section className="birthday-msg-content--root mx-3 text-white my-5">
                <h2 className="text-subtitle my-2">Mensagem Atual:</h2>
                {edit ? showEditField() : showMsg()}
            </section>
            {showNotes()}
        </section>
    );
}
