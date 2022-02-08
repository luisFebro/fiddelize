import { useState, Fragment, useEffect } from "react";
import moneyMaskBr from "utils/validation/masks/moneyMaskBr";
import { convertBrToDollar } from "utils/numbers/convertDotComma";
import useData from "init";
import showToast from "components/toasts";
import TextField from "@material-ui/core/TextField";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { useReadUser, updateUser } from "api/frequent";

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

export default function RegisterBonusCoins() {
    const [editPTS, setEditPTS] = useState(false);
    const [isOn, setOn] = useState(false);
    const [PTS, setPTS] = useState("0");
    const [showMoreTxt, setShowMoreTxt] = useState(false);

    const noPTS = PTS === "0.00" || PTS === "0" || !PTS;

    const styles = getStyles();

    const [firstName, userId] = useData(["firstName", "userId"]);
    const maskedPTS = moneyMaskBr(PTS);

    const { data, loading } = useReadUser(
        userId,
        "cliente-admin",
        "clientAdminData.registerBonusCoins.amount",
        {
            trigger: userId !== "...",
        }
    );

    useEffect(() => {
        if (!data) return;

        const registerData =
            data.clientAdminData && data.clientAdminData.registerBonusCoins;

        if (registerData) {
            const pts = registerData.amount;
            setOn(!noPTS || pts);
            setPTS(Number(pts).toFixed(2).toString());
        }
    }, [data]);

    const handleUpdateData = async () => {
        if (userId === "...") return null;

        const body = {
            "clientAdminData.registerBonusCoins.amount":
                convertBrToDollar(maskedPTS) || 0,
        };

        const role = "cliente-admin";
        await updateUser(userId, role, body).catch((err) => {
            showToast("Ocorreu um erro ao atualizar", { type: "error" });
            console.log(`ERROR: ${err}`);
        });

        const msg = noPTS
            ? "A funcionalidade de Moeda Bônus de Cadastro foi desativada"
            : "quantia de PTS atualizada e será creditada nos próximos cadastros de cliente ao seu clube";

        showToast(`${firstName}, ${msg}`, {
            type: noPTS ? "warning" : "success",
            dur: 10000,
        });

        setOn(!noPTS);
        setEditPTS(false);
        return null;
    };

    const showMainPTS = () => (
        <Fragment>
            <div className="text-small font-weight-bold text-center">
                atual:{" "}
                <span className="text-em-3">
                    {loading ? "..." : maskedPTS || 0}
                </span>{" "}
                <span className="text-normal font-weight-bold">PTS</span>
            </div>
            <div className="mx-3 my-3 container-center">
                <ButtonFab
                    title={isOn ? "Alterar Qtde." : "Ativar Moeda Bônus"}
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
            <p className="m-0 text-center">Quantia Moeda:</p>
            <TextField
                placeholder="0,00"
                InputProps={{
                    style: styles.fieldFormValueForPts,
                }}
                inputProps={{ style: styles.input }}
                name="PTS"
                value={noPTS ? undefined : maskedPTS}
                variant="outlined"
                onChange={(e) => setPTS(e.target.value)}
                error={false}
                autoComplete="off"
            />
            <div className="my-3 container-center">
                <ButtonFab
                    title={isOn ? "Alterar Qtde." : "Ativar Moeda Bônus"}
                    position="relative"
                    onClick={() => handleUpdateData()}
                    color="white"
                    backgroundColor="var(--themeSDark--default)"
                    variant="extended"
                    size="large"
                />
            </div>
        </section>
    );

    return (
        <section className="text-purple">
            <h2 className="text-center text-normal font-weight-bold">
                Moeda Bônus de Cadastro
            </h2>
            <p className="text-normal text-grey">
                Ofereça PTS extras como <strong>estímulo adicional</strong> para
                clientes começarem a participar do seu clube de compras.{" "}
                <span
                    role="button"
                    className={`text-link ${showMoreTxt ? "d-none" : ""}`}
                    onClick={() => setShowMoreTxt(true)}
                >
                    saiba mais
                </span>
            </p>
            {showMoreTxt && (
                <p className="text-normal text-grey">
                    Todos os seus clientes recebem automaticamente certa quantia
                    em moeda PTS ao se cadastrarem. Você define o valor de
                    acordo com sua estratégia comercial.
                </p>
            )}
            <section className="py-5">
                <p className="m-0 text-normal text-center">
                    Ativado?{" "}
                    <span className="text-pill">{isOn ? "SIM" : "NÃO"}</span>
                </p>
                {editPTS ? showEditPTS() : showMainPTS()}
            </section>
        </section>
    );
}
