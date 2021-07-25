import { useState, Fragment, useEffect } from "react";
import Title from "components/Title";
import { gameIconsStore } from "components/biz/GamesBadge";
import BackButton from "components/buttons/BackButton";
import SwitchBtn from "components/buttons/material-ui/SwitchBtn";
import useData from "init";
import { updateUser } from "api/frequent";
import showToast from "components/toasts";
import NumberField from "components/fields/NumberField";
import RadiusBtn from "components/buttons/RadiusBtn";
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
        prizeDeadline: null,
        challList: [],
    });

    const GAME = "targetPrize";
    const { on, prizeDeadline, challList, updatedOnce } = optionData;
    const allDataReady = Boolean(prizeDeadline);

    const { userId } = useData();

    useEffect(() => {
        if (!gameData) return;

        const {
            on: thisOn,
            prizeDeadline: deadline,
            challList: list,
        } = gameData;
        setOptionData((prev) => ({
            ...prev,
            on: thisOn,
            prizeDeadline: deadline,
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

        const handlePrizeDeadline = async () => {
            const dataToSend = {
                [`clientAdminData.games.${GAME}.prizeDeadline`]: prizeDeadline,
            };
            await updateUser(userId, "cliente-admin", dataToSend);
            showToast(
                `Salvo! Novo prazo de ${prizeDeadline} DIAS será mostrado no app dos clientes que ganharem prêmios`,
                { type: "success", dur: 9000 }
            );
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
                    disableToRight={!allDataReady || !updatedOnce}
                    disableToRightCallback={() =>
                        showToast(
                            "Favor, preencha e salve todos os dados abaixo para ativar o jogo",
                            { type: "error" }
                        )
                    }
                />
                <p className="mt-5 text-center font-weight-bold">
                    Prazo Resgate Prêmio:
                </p>
                <div className="d-flex">
                    <NumberField
                        type="integer"
                        name="prizeDeadline"
                        textAlign="text-center"
                        size="large"
                        width={100}
                        placeholder="0"
                        value={prizeDeadline}
                        onChangeCallback={setOptionData}
                    />
                    <p className="d-inline-block font-weight-bold">Dias</p>
                </div>
                <div className="mt-2" />
                <RadiusBtn
                    position="relative"
                    backgroundColor="var(--themeSDark)"
                    title="salvar"
                    size="medium"
                    fontSize="15px"
                    onClick={handlePrizeDeadline}
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
