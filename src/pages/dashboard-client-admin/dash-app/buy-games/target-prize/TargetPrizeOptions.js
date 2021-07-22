import { useState, Fragment, useEffect } from "react";
import Title from "components/Title";
import InstructionBtn from "components/buttons/InstructionBtn";
import { gameIconsStore } from "components/biz/GamesBadge";
import BackButton from "components/buttons/BackButton";
import SwitchBtn from "components/buttons/material-ui/SwitchBtn.js";
import useData from "init";
import { useReadUser, updateUser } from "api/frequent";
import showToast from "components/toasts";
import NumberField from "components/fields/NumberField";
import RadiusBtn from "components/buttons/RadiusBtn";
import ChallengesList from "./challenges-list/ChallengesList";
import ShowBizNotes from "./challenges-list/ShowBizNotes";
import AddNewPrizeBtn from "./add-new-prize/AddNewPrizeBtn";

export default function TargetPrizeOptions({ setComp }) {
    const [optionData, setOptionData] = useState({
        on: null,
        prizeDeadline: null,
        challList: [],
    });

    const GAME = "targetPrize";
    const { on, prizeDeadline, challList } = optionData;

    const [triggerList, setTriggerList] = useState("");
    const { userId } = useData();

    // const { bizId } = useBizData();
    const { data, loading } = useReadUser(
        userId,
        "cliente-admin",
        `clientAdminData.games.${GAME}`,
        {
            trigger: triggerList || userId, // triggerList is an random id
        }
    );

    useEffect(() => {
        if (!data) return;

        const {
            on: thisOn,
            prizeDeadline: deadline,
            challList: list,
        } = data.clientAdminData.games[GAME];
        setOptionData((prev) => ({
            ...prev,
            on: thisOn,
            prizeDeadline: deadline,
            challList: list,
        }));
    }, [data]);

    const styles = {
        iconPos: {
            top: 0,
            right: -20,
        },
    };

    const showBackBtn = () => (
        <div className="d-flex justify-content-start">
            <BackButton title="Voltar" onClick={() => setComp(null)} />
        </div>
    );

    const showBtnAction = () => (
        <div className="container-center my-5">
            <section className="position-relative">
                <AddNewPrizeBtn setTriggerList={setTriggerList} />
            </section>
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
                    <div className="position-absolute" style={styles.iconPos}>
                        <InstructionBtn
                            mode="modal"
                            article="ChallengeModes_art2"
                        />
                    </div>
                </section>
            </div>
            <ChallengesList loading={loading} challList={challList} />
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
            {showBtnAction()}
            <ShowBizNotes />
        </section>
    );
}

/* ARCHIVES

<PremiumButton
    right={-60}
    top={-40}
    service="Prêmmios Clientes"
    proPage="PremmiosClientes_pro"
/>

*/
