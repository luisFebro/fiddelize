import { useState, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "components/Title";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import InstructionBtn from "components/buttons/InstructionBtn";
import SwitchBtn from "components/buttons/material-ui/SwitchBtn";
import PremiumButton from "components/buttons/premium/PremiumButton";
import getId from "utils/getId";
import { useBizData } from "init";
import List from "./List.js";

export default function HiddenGoalsAndRewards() {
    const [mode, setMode] = useState("Constante");
    const [needAdd, setNeedAdd] = useState("");
    const [hideAddBtn, setHideAddBtn] = useState(false);

    const { bizId } = useBizData();

    const styles = {
        iconPos: {
            top: 0,
            right: -50,
        },
    };

    const showBtnAction = () =>
        !hideAddBtn && (
            <div className="container-center my-5">
                <section className="position-relative">
                    <ButtonFab
                        position="relative"
                        onClick={() => setNeedAdd(getId())}
                        title="adicionar"
                        iconFontAwesome={<FontAwesomeIcon icon="plus" />}
                        iconFontSize="25px"
                        variant="extended"
                        fontWeight="bolder"
                        fontSize=".9em"
                        size="large"
                        color="white"
                        backgroundColor="var(--themeSDark--default)"
                        needBtnShadow={false}
                    />
                    <PremiumButton
                        right={-60}
                        top={-40}
                        service="Prêmmios Clientes"
                        proPage="PremmiosClientes_pro"
                    />
                </section>
            </div>
        );

    const showModeTitle = () => (
        <div className="container-center">
            <section className="position-relative">
                <Title
                    title="&#187; Modo Atual:"
                    subTitle={mode}
                    color="var(--themeP)"
                    margin=" "
                    padding=" "
                    subTitleClassName="font-weight-bold"
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
            {showModeTitle()}
            <List
                setMode={setMode}
                setHideAddBtn={setHideAddBtn}
                mode={mode}
                needAdd={needAdd}
            />
            {showBtnAction()}
        </Fragment>
    );

    return (
        <div className="hidden-content--root text-normal">
            {showChallModeSection()}
        </div>
    );
}

/* ARCHIVES
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
