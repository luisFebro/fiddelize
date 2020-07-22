import React, { useState, Fragment } from 'react';
import Title from '../../../../../components/Title';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonFab from '../../../../../components/buttons/material-ui/ButtonFab';
import InstructionBtn from '../../../../../components/buttons/InstructionBtn';
import List from './List.js';
import uuidv1 from 'uuid/v1';
import SwitchBtn from '../../../../../components/buttons/material-ui/SwitchBtn'
import { useClientAdmin, useAppSystem } from '../../../../../hooks/useRoleData';
import useAPI, { updateUser, treatBoolStatus } from '../../../../../hooks/api/useAPI';

export default function HiddenGoalsAndRewards() {
    const [mode, setMode] = useState("Constante");
    const [needAdd, setNeedAdd] = useState('');
    const [hideAddBtn, setHideAddBtn] = useState(false);
    const [visibleToggleBtn, setVisibleToggleBtn] = useState(undefined);

    const { businessId } = useAppSystem();
    const { arePrizesVisible } = useClientAdmin();

    // LESSON: dont declare db keys as object as will delete all others. INtead, write as string paths like clientAdminData.arePrizesVisible clientAdminData, not arePrizesVisible { arePrizesVisible ...
    const body = {
        "clientAdminData.arePrizesVisible": treatBoolStatus(visibleToggleBtn),
    }
    useAPI({ method: "put", url: updateUser(businessId), body, trigger: visibleToggleBtn })

    const handleVisibility = res => {
        setVisibleToggleBtn(res);
    }

    const styles = {
        iconPos: {
            top: 0,
            right: -50,
        },
        visibleInstruBtn: {
            top: -15,
            right: -15,
        }
    }

    const showPrizeAndGoalsVisibility = () => {
        return(
            <section className="container-center-col">
                <section className="position-relative">
                    <header className="mb-3 text-purple font-weight-bold text-subtitle text-center">
                        Revelar prêmios e metas para clientes?
                    </header>
                    <div className="position-absolute" style={styles.visibleInstruBtn}>
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
                    defaultStatus={arePrizesVisible}
                />
                <hr className="lazer-purple"/>
            </section>
        );
    }

    const showBtnAction = () => (
        !hideAddBtn &&
        <div className="container-center my-5">
            <ButtonFab
                position="relative"
                onClick={() => setNeedAdd(uuidv1())}
                title="adicionar"
                iconFontAwesome={<FontAwesomeIcon icon="plus" />}
                iconFontSize="25px"
                variant="extended"
                fontWeight="bolder"
                fontSize=".9em"
                size="large"
                color={"white"}
                backgroundColor={"var(--themeSDark--default)"}
                needBtnShadow={false}
            />
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
            {showPrizeAndGoalsVisibility()}
            {showChallModeSection()}
        </div>
    );
}