import { useState, useEffect } from "react";
import BackButton from "components/buttons/BackButton";
import { gameIconsStore } from "components/biz/GamesBadge";
import { updateUser } from "api/frequent";
import showToast from "components/toasts";
import SwitchBtn from "components/buttons/material-ui/SwitchBtn.js";
import getId from "utils/getId";
import useData from "init";
import CoreOptionsForm from "./CoreOptionsForm";

export default function DiscountBackOptions({
    setComp,
    loading,
    setTriggerList,
    gameData,
    needBlockDisableNextGame = false,
}) {
    const [optionData, setOptionData] = useState({
        updatedOnce: false, // make sure user saved data before activating game
        on: null,
        perc: null,
        targetPoints: null,
        targetMoney: 0,
    });
    const GAME = "discountBack";

    const { updatedOnce, on, targetPoints, targetMoney, perc } = optionData;
    const allDataReady = Boolean(targetMoney && targetMoney && perc);

    const { userId } = useData();

    useEffect(() => {
        if (!gameData) return;

        const {
            on: thisOn,
            targetMoney: voucherVal,
            targetPoints: pts,
            perc: buyPerc,
        } = gameData;

        setOptionData((prev) => ({
            ...prev,
            on: thisOn,
            targetMoney: !voucherVal ? 0 : voucherVal,
            targetPoints: pts,
            perc: buyPerc,
            updatedOnce: false,
        }));
    }, [gameData]);

    const showBackBtn = () => (
        <div className="d-flex justify-content-start">
            <BackButton
                title="Voltar"
                onClick={() => setComp({ name: "", props: {} })}
            />
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

    const showPowerSwitch = () => {
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

            // update main list
            setTriggerList(getId());
        };

        return (
            <section>
                <p className="text-center font-weight-bold">Jogo Ativado?</p>
                <SwitchBtn
                    titleLeft="Não"
                    titleRight="Sim"
                    defaultStatus={on}
                    loading={loading}
                    disableToLeft={needBlockDisableNextGame}
                    disableToLeftCallback={() =>
                        showToast(
                            "Pelo menos um jogo deve fica ativo para clientes",
                            { type: "error" }
                        )
                    }
                    disableToRight={!allDataReady || !updatedOnce}
                    disableToRightCallback={() =>
                        showToast(
                            "Favor, preencha e salve todos os campos abaixo para ativar o jogo",
                            { type: "error" }
                        )
                    }
                    callback={handleActivation}
                />
            </section>
        );
    };

    const showGeneratedAd = () => (
        <section className="animated fadeInUp my-5 font-site text-em-0-8">
            <h2 className="text-center text-subtitle font-weight-bold">
                Resultado
            </h2>
            <h2 className="text-normal font-weight-bold">
                Exemplos práticos de divulgação para clientes:
            </h2>
            <p className="mt-2 text-grey font-italic font-weight-bold">
                &quot;A cada{" "}
                <span className="text-pill">R$ {targetPoints}</span> em compras,
                nossa clientela ganha <span className="text-pill">{perc}%</span>{" "}
                de desconto!&quot;
            </p>
            <p className="text-grey font-italic font-weight-bold">ou</p>
            <p className="text-grey font-italic font-weight-bold">
                &quot;A cada{" "}
                <span className="text-pill">{targetPoints} PTS</span> em
                compras, você ganha um vale desconto no valor de{" "}
                <span className="text-pill">R${targetMoney}</span>&quot;
            </p>
            <p className="text-grey font-italic font-weight-bold">ou</p>
            <p className="text-grey font-italic font-weight-bold">
                &quot;A cada compra, você ganha PTS - a moeda digital de pontos
                de compra para troca de benefícios - e acumula até{" "}
                <span className="text-pill">{perc}%</span> de desconto no nosso
                clube de compras&quot;
            </p>
        </section>
    );

    return (
        <section
            className={`hidden-content--root text-normal ${
                on ? "text-purple" : "text-grey"
            }`}
        >
            {showBackBtn()}
            {showGameTitle()}
            {showPowerSwitch()}
            <CoreOptionsForm
                targetPoints={targetPoints}
                perc={perc}
                targetMoney={targetMoney}
                setData={setOptionData}
                userId={userId}
            />
            {allDataReady && showGeneratedAd()}
        </section>
    );
}
