import { useState, useEffect, Fragment } from "react";
import TextField from "@material-ui/core/TextField";
import { useReadUser, updateUser } from "api/frequent";
import useData, { useBizData } from "init";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import showToast from "components/toasts";
import handleChange from "utils/form/use-state/handleChange";
import { convertBrToDollar } from "utils/numbers/convertDotComma";
import moneyMaskBr from "utils/validation/masks/moneyMaskBr";

const getStyles = () => ({
    fieldFormValue: {
        backgroundColor: "var(--mainWhite)",
        color: "var(--themeP)",
        fontSize: "20px",
        fontFamily: "var(--mainFont)",
    },
    fieldFormValueForPts: {
        backgroundColor: "var(--mainWhite)",
        color: "var(--themeP)",
        fontSize: "3em",
        zIndex: 2000,
        width: 270,
        padding: 0,
    },
    input: {
        padding: "10px",
    },
});

export default function BirthdayMsgContent() {
    const [edit, setEdit] = useState(false);
    const [editPTS, setEditPTS] = useState(false);
    const [birthdayPTS, setBirthdayPTS] = useState("0");

    const maskedBirthdayPTS = moneyMaskBr(birthdayPTS);

    const { bizName } = useBizData();
    const [birthdayMsg, setBirthdayMsg] = useState(
        `a ${bizName} está passando aqui neste dia especial para te desejar um feliz aniversário com mais saúde e conquistas!`
    );

    const styles = getStyles();
    const [firstName, userId] = useData(["firstName", "userId"]);

    const { data, loading } = useReadUser(
        userId,
        "cliente-admin",
        "clientAdminData.birthdayMsg clientAdminData.birthdayPTS",
        {
            trigger: userId !== "...",
        }
    );

    useEffect(() => {
        if (!data) return;

        const cliAdmin = data.clientAdminData;
        const msg = cliAdmin && cliAdmin.birthdayMsg;
        const pts = cliAdmin && cliAdmin.birthdayPTS;

        if (msg) setBirthdayMsg(msg);
        if (pts) setBirthdayPTS(Number(pts).toFixed(2).toString());
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

    const handleUpdateData = (field) => {
        if (userId === "...") return;

        const isMsg = field === "birthdayMsg";

        const targetData = isMsg
            ? birthdayMsg
            : convertBrToDollar(maskedBirthdayPTS);

        // LESSON: if there is semicollon before a self-called async method like below, then it will throw an Object-not-a-function error.Object-not-a-function;
        // So, to avoid this issue, insert a semicollon demantorily right at the end of prior command line

        (async () => {
            const body = {
                [`clientAdminData.${field}`]: targetData,
            };

            const role = "cliente-admin";
            await updateUser(userId, role, body).catch((err) => {
                showToast("Ocorreu um erro ao atualizar", { type: "error" });
                console.log(`ERROR: ${err}`);
            });

            const succMsg = isMsg
                ? "mensagem para clientes de aniversário atualizada!"
                : "quantia de PTS atualizada e será creditado nos próximos aniversários dos clientes";

            showToast(`${firstName}, ${succMsg}`, { type: "success" });

            if (isMsg) setEdit(false);
            else setEditPTS(false);
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
                    onClick={() => handleUpdateData("birthdayMsg")}
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
        <div className="mx-3 text-purple text-normal mb-5">
            <p className="font-weight-bold">Como a mensagem é enviada?</p>
            <p>
                Sua mensagem é enviada com sua marca como uma notificação para o
                app do cliente e/ou email como mostrado no exemplo a seguir:
            </p>
            <div className="my-2 container-center">
                <img
                    className="shadow-babadoo"
                    width={300}
                    src="/img/demos/customer-birthdays/customer-birthday-1.png"
                    alt="1"
                />
            </div>
            <div className="mt-4 mb-2 container-center">
                <img
                    className="shadow-babadoo"
                    width={300}
                    src="/img/demos/customer-birthdays/customer-birthday-2.png"
                    alt="2"
                />
            </div>
            <p className="my-4">
                Caso opte por dar alguns PTS no dia do aniversário dos clientes,
                a quantia é registrada no histórico de compras como{" "}
                <strong>pontos extras</strong>.
            </p>
            <div className="my-2 container-center">
                <img
                    className="shadow-babadoo"
                    width={300}
                    src="/img/demos/customer-birthdays/customer-birthday-3.png"
                    alt="3"
                />
            </div>
            <p className="my-4">
                O nome do cliente é incluído automaticamente no título de cada
                notificação.
            </p>
        </div>
    );

    const showMainPTS = () => (
        <Fragment>
            <div className="text-small font-weight-bold text-center">
                atual:{" "}
                <span className="text-em-3">
                    {loading ? "..." : maskedBirthdayPTS}
                </span>{" "}
                <span className="text-normal font-weight-bold">PTS</span>
            </div>
            <div className="mx-3 my-3 container-center">
                <ButtonFab
                    title="Alterar Qtde."
                    width="100%"
                    position="relative"
                    onClick={() => setEditPTS(true)}
                    color="white"
                    backgroundColor="var(--themeSDark--default)"
                    variant="extended"
                    size="large"
                />
            </div>
        </Fragment>
    );

    const showEditPTS = () => (
        <section className="my-5 text-normal text-center text-purple">
            <TextField
                placeholder="0,00"
                InputProps={{
                    style: styles.fieldFormValueForPts,
                }}
                inputProps={{ style: styles.input }}
                name="birthdayPTS"
                value={maskedBirthdayPTS}
                variant="outlined"
                onChange={(e) => setBirthdayPTS(e.target.value)}
                error={false}
                autoComplete="off"
            />
            <div className="my-3 container-center">
                <ButtonFab
                    title="Atualizar Qtde."
                    position="relative"
                    onClick={() => handleUpdateData("birthdayPTS")}
                    color="white"
                    backgroundColor="var(--themeSDark--default)"
                    variant="extended"
                    size="large"
                />
            </div>
        </section>
    );

    return (
        <section>
            {showTitle()}
            <section className="birthday-msg-content--root mx-3 text-white my-5">
                <h2 className="text-subtitle my-2">Mensagem Atual:</h2>
                {edit ? showEditField() : showMsg()}
                <style jsx>
                    {`
                        .birthday-msg-content--root {
                            background: var(--themePDark);
                            padding: 15px;
                            border-radius: 20px;
                        }
                    `}
                </style>
            </section>
            <section className="add-pts-on-birthday text-purple text-normal mb-5">
                <h2 className="text-normal my-2 mx-3">
                    Quer também <strong>creditar PTS como presente</strong> na
                    conta dos clientes no dia dos seus aniversários?
                </h2>
                {editPTS ? showEditPTS() : showMainPTS()}
            </section>
            {showNotes()}
        </section>
    );
}
