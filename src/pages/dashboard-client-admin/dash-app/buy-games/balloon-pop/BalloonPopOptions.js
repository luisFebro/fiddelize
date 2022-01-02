import { useState, useEffect, Fragment } from "react";
import Title from "components/Title";
import BackButton from "components/buttons/BackButton";
import { gameIconsStore } from "components/biz/GamesBadge";
import { updateUser } from "api/frequent";
import showToast from "components/toasts";
import SwitchBtn from "components/buttons/material-ui/SwitchBtn.js";
import getId from "utils/getId";
import useData from "init";
import BenefitsList from "./benefits-list/BenefitsList.js";
// import ShowQA from "../target-prize/challenges-list/ShowQA";

export default function DiscountBackOptions({
    setComp,
    loading,
    setTriggerList,
    gameData,
    needBlockDisableNextGame = false,
}) {
    const [optionData, setOptionData] = useState({
        // updatedOnce: false, // make sure user saved data before activating game
        on: null,
        beneList: [],
    });
    const GAME = "balloonPop";
    const GAME_BR = "estoure balão";

    const { on, beneList = [] } = optionData;
    const isReadyList = beneList.length >= 2;
    // use it to make sure got all important data before activate with the switch

    const { userId } = useData();

    useEffect(() => {
        if (!gameData) return;

        const { on: thisOn, beneList: list } = gameData;

        setOptionData((prev) => ({
            ...prev,
            on: thisOn,
            beneList: list,
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
            <h1
                className="discount-back-title ml-1 text-pill font-site text-subtitle font-weight-bold text-center"
                style={{
                    backgroundColor: on ? "var(--themeP)" : "grey",
                }}
            >
                {gameIconsStore[GAME]}
                Estoure Balão
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
            const selectedMsg = `Jogo ${GAME_BR.toUpperCase()} está agora ${
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
                    disableToRight={!isReadyList}
                    disableToRightCallback={() =>
                        showToast(
                            "Para ativar este jogo, é preciso precisar - pelo menos - 2 tipos de benefícios na lista abaixo. Ex: desconto, brinde, oferta, amostra, etc",
                            { type: "error" }
                        )
                    }
                    callback={handleActivation}
                />
            </section>
        );
    };

    const showBenefitsList = () => (
        <Fragment>
            <div className="container-center">
                <section className="position-relative">
                    <Title
                        title="LISTA DE BENEFÍCIOS"
                        subTitle="Adicione benefícios instantâneos como brindes e descontos."
                        color={on ? "var(--themeP)" : "grey"}
                        margin=" "
                        padding=" "
                        fontSize="text-normal"
                        className="font-weight-bold"
                        subTitleClassName=" "
                    />
                </section>
            </div>
            <BenefitsList
                loading={loading}
                challList={beneList}
                setOptionData={setOptionData}
            />
        </Fragment>
    );

    return (
        <section
            className={`hidden-content--root text-normal ${
                on ? "text-purple" : "text-grey"
            }`}
        >
            {showBackBtn()}
            {showGameTitle()}
            {showControlOptions()}
            <hr className="lazer-purple" />
            {showBenefitsList()}
        </section>
    );
}
