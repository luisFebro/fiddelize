import { useState, useEffect } from "react";
import BackButton from "components/buttons/BackButton";
import { gameIconsStore } from "components/biz/GamesBadge";
import { useReadUser, updateUser } from "api/frequent";
import showToast from "components/toasts";
import SwitchBtn from "components/buttons/material-ui/SwitchBtn.js";
import useData from "init";

export default function DiscountBackOptions({ setComp }) {
    const [optionData, setOptionData] = useState({
        on: null,
    });
    const GAME = "discountBack";
    const { on } = optionData;
    const { userId } = useData();

    const { data, loading } = useReadUser(
        userId,
        "cliente-admin",
        `clientAdminData.games.${GAME}`,
        {
            trigger: userId,
        }
    );

    useEffect(() => {
        if (!data) return;

        const { on: thisOn } = data.clientAdminData.games[GAME];
        setOptionData((prev) => ({
            ...prev,
            on: thisOn,
        }));
    }, [data]);

    const showBackBtn = () => (
        <div className="d-flex justify-content-start">
            <BackButton title="Voltar" onClick={() => setComp(null)} />
        </div>
    );

    const showGameTitle = () => (
        <section className="my-3 container-center">
            {gameIconsStore[GAME]}
            <h1
                className="discount-back-title ml-1 text-pill font-site text-subtitle font-weight-bold text-center"
                style={{
                    backgroundColor: on ? "var(--themeP)" : "grey",
                }}
            >
                Desconto
                <br />
                Retornado
                <style jsx>
                    {`
                        .discount-back-title {
                            line-height: 25px;
                            padding: 5px 20px;
                        }
                    `}
                </style>
            </h1>
        </section>
    );

    const showControlOptions = () => {
        const handleActivation = async (res) => {
            const isTruthy = res && res.includes("true");

            const dataToSend = {
                [`clientAdminData.games.${GAME}.on`]: isTruthy,
            };

            await updateUser(userId, "cliente-admin", dataToSend);
            setOptionData((prev) => ({ ...prev, on: isTruthy }));
            const selectedMsg = `Jogo DESCONTO RETORNADO está agora ${
                isTruthy ? "ATIVADO" : "DESATIVADO"
            } para todos seus clientes`;

            showToast(selectedMsg, {
                type: isTruthy ? "success" : "warning",
                dur: 9000,
            });
        };

        return (
            <section>
                <p className="text-center font-weight-bold">Jogo Ativado?</p>
                <SwitchBtn
                    titleLeft="Não"
                    titleRight="Sim"
                    defaultStatus={on}
                    loading={loading}
                    callback={handleActivation}
                />
            </section>
        );
    };

    return (
        <section
            className={`hidden-content--root text-normal ${
                on ? "text-purple" : "text-grey"
            }`}
        >
            {showBackBtn()}
            {showGameTitle()}
            {showControlOptions()}
        </section>
    );
}
