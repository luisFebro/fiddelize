import { useState, Fragment } from "react";
import Title from "components/Title";
import InstructionBtn from "components/buttons/InstructionBtn";
import BackButton from "components/buttons/BackButton";
import ChallengesList from "./challenges-list/ChallengesList";
import ShowBizNotes from "./challenges-list/ShowBizNotes";
import AddNewPrizeBtn from "./add-new-prize/AddNewPrizeBtn";

export default function TargetPrizeOptions({ setComp }) {
    const [triggerList, setTriggerList] = useState("");

    // const { bizId } = useBizData();

    const styles = {
        iconPos: {
            top: 0,
            right: -20,
        },
    };

    const showBackBtn = () => (
        <div className="d-flex justify-content-start">
            <BackButton title="Voltar Opções" onClick={() => setComp(null)} />
        </div>
    );

    const showBtnAction = () => (
        <div className="container-center my-5">
            <section className="position-relative">
                <AddNewPrizeBtn setTriggerList={setTriggerList} />
            </section>
        </div>
    );

    const showTitle = () => (
        <div className="container-center">
            <section className="position-relative">
                <Title
                    title="&#187; Prêmios"
                    subTitle="Adicione prêmio(s), metas e personalize com ícones de cada desafio"
                    color="var(--themeP)"
                    margin=" "
                    padding=" "
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
    );

    const showChallModeSection = () => (
        <Fragment>
            {showTitle()}
            <ChallengesList triggerList={triggerList} />
            {showBtnAction()}
        </Fragment>
    );

    return (
        <section className="hidden-content--root text-normal">
            {showBackBtn()}
            {showChallModeSection()}
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

// LESSON: dont declare db keys as object as will delete all others. INtead, write as string paths
    const body = {
        "clientAdminData.games.targetPrize.arePrizgfdgfdesVisible": treatBoolStatus(
            visibleToggleBtn
        ),
    };
    useUpdateUser(bizId, "cliente-admin", body);

const showPrizeAndGoalsVisibility = () => (
    <section className="container-center-col">
        <section className="position-relative">
            <header className="mb-3 text-purple font-weight-bold text-subtitle text-center">
                Revelar prêmios e metas para clientes?
            </header>
            <div
                className="position-absolute"
                style={styles.visibleInstruBtn}
            >
                <InstructionBtn
                    mode="modal"
                    article="GiftVisibility_art1"
                />
            </div>
        </section>
        <SwitchBtn
            titleLeft="Escondido<br />Durante<br />Desafios"
            titleRight="Sempre<br />Revelado"
            callback={handleVisibility}
            defaultStatus={arePrizesdfgfdVisible}
        />
        <hr className="lazer-purple" />
    </section>
);
 */
