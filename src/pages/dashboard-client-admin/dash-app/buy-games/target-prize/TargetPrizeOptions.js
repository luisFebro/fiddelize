import { useState, Fragment, useEffect } from "react";
import Title from "components/Title";
import { gameIconsStore } from "components/biz/GamesBadge";
import BackButton from "components/buttons/BackButton";
import SwitchBtn from "components/buttons/material-ui/SwitchBtn";
import useData from "init";
import { updateUser } from "api/frequent";
import showToast from "components/toasts";
import getId from "utils/getId";
import ChallengesList from "./challenges-list/ChallengesList";
import ShowBizNotes from "./challenges-list/ShowBizNotes";

export default function TargetPrizeOptions({
    setComp,
    loading,
    gameData,
    setTriggerList,
    needBlockDisableNextGame = false,
}) {
    const [optionData, setOptionData] = useState({
        updatedOnce: false, // make sure user saved data before activating game
        on: null,
        challList: [],
    });

    const GAME = "targetPrize";
    const { on, benefitsExpDays, challList, updatedOnce } = optionData;
    // use it to make sure got all important data before activate with the switch
    // const allDataReady = true;

    const { userId } = useData();

    useEffect(() => {
        if (!gameData) return;

        const { on: thisOn, challList: list } = gameData;
        setOptionData((prev) => ({
            ...prev,
            on: thisOn,
            challList: list,
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
                className="ml-3 text-pill text-subtitle font-weight-bold text-center"
                style={{
                    backgroundColor: on ? "var(--themeP)" : "grey",
                }}
            >
                Prêmio Alvo
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
            const selectedMsg = `Jogo PRÊMIO ALVO está agora ${
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
                    callback={handleActivation}
                    disableToLeft={needBlockDisableNextGame}
                    disableToLeftCallback={() =>
                        showToast(
                            "Pelo menos um jogo deve fica ativo para clientes",
                            { type: "error" }
                        )
                    }
                    disableToRight={!updatedOnce} // !allDataReady ||
                    disableToRightCallback={() =>
                        showToast(
                            "Favor, preencha e salve todos os dados abaixo para ativar o jogo",
                            { type: "error" }
                        )
                    }
                />
            </section>
        );
    };

    const showChallengesList = () => (
        <Fragment>
            <div className="container-center">
                <section className="position-relative">
                    <Title
                        title="LISTA DE PRÊMIOS"
                        subTitle="Adicione prêmio(s), metas e personalize com ícones de cada desafio"
                        color={on ? "var(--themeP)" : "grey"}
                        margin=" "
                        padding=" "
                        fontSize="text-normal"
                        className="font-weight-bold"
                        subTitleClassName=" "
                    />
                </section>
            </div>
            <ChallengesList
                loading={loading}
                challList={challList}
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
            {showChallengesList()}
            <ShowBizNotes />
        </section>
    );
}
