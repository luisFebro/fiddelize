import { useState, useEffect, Fragment } from "react";
import Title from "components/Title";
import BackButton from "components/buttons/BackButton";
import { gameIconsStore } from "components/biz/GamesBadge";
import { updateUser } from "api/frequent";
import showToast from "components/toasts";
import SwitchBtn from "components/buttons/material-ui/SwitchBtn.js";
import getId from "utils/getId";
import useData, { useBizData } from "init";
import AddNewChallContent from "pages/dashboard-client-admin/dash-app/buy-games/discount-back/challenges-list/add-new-chall/AddNewChallContent";
import ChallengesList from "./challenges-list/ChallengesList";
import ShowQA from "../target-prize/challenges-list/ShowQA";

export default function DiscountBackOptions({
    setComp,
    loading,
    setTriggerList,
    gameData,
    isDigitalMenu = false,
}) {
    const { onlineGames } = useBizData();

    const handleStatusDigitalMenu = (type) => {
        const statusGameOnline =
            onlineGames &&
            onlineGames.discountBack &&
            onlineGames.discountBack.on;

        if (type === "on") {
            return statusGameOnline;
        }

        if (type === "updatedOnce") {
            if (statusGameOnline) return true;
            const challList =
                onlineGames &&
                onlineGames.discountBack &&
                onlineGames.discountBack.challList;
            if (challList && challList.length) return true;
            return false;
        }
    };

    const [optionData, setOptionData] = useState({
        updatedOnce: isDigitalMenu
            ? handleStatusDigitalMenu("updatedOnce")
            : false, // make sure user saved data before activating game
        on: isDigitalMenu ? handleStatusDigitalMenu("on") : null,
        challList: [],
    });
    const GAME = "discountBack";
    const needBlockDisableNextGame = false; // it is always false because cli-admin now can select buy flow solutions. Their customers will have no game available in the game session, though

    const { on, updatedOnce, challList } = optionData;
    // use it to make sure got all important data before activate with the switch

    const { userId } = useData();

    useEffect(() => {
        if (!gameData || isDigitalMenu) return;

        const { on: thisOn, challList: list } = gameData;

        setOptionData((prev) => ({
            ...prev,
            on: thisOn,
            challList: list,
        }));
    }, [gameData, isDigitalMenu]);

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

    const showControlOptions = () => {
        const handleActivation = async (res) => {
            const isTruthy = res && res.includes("true");

            const dataToSend = {
                [`clientAdminData.${
                    isDigitalMenu ? "onlineGames" : "games"
                }.${GAME}.on`]: isTruthy,
                // this following line is required in every online game
                "clientAdminData.onlineGames.currGame": isTruthy
                    ? "discountBack"
                    : null,
            };

            await updateUser(userId, "cliente-admin", dataToSend);
            setOptionData((prev) => ({
                ...prev,
                on: isTruthy,
                updatedOnce: isDigitalMenu ? true : prev.updatedOnce,
            }));
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
                    disableToRight={!updatedOnce}
                    disableToRightCallback={() =>
                        showToast(
                            "Adicione, pelo menos, um desafio para ativar Desconto Retornado.",
                            { type: "error" }
                        )
                    }
                    callback={handleActivation}
                />
            </section>
        );
    };

    // Digital Menu allows only one challenge
    const showChallengesList = () => (
        <Fragment>
            <div className="container-center">
                <section className="position-relative">
                    <Title
                        title="LISTA DE DESAFIOS"
                        subTitle="No jogo desconto retornado, você pode adicionar diferentes vales descontos e metas para seus clientes"
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
            {isDigitalMenu ? (
                <section>
                    <AddNewChallContent isDigitalMenu={isDigitalMenu} />
                </section>
            ) : (
                <Fragment>
                    {showChallengesList()}
                    <ShowQA />
                </Fragment>
            )}
        </section>
    );
}
