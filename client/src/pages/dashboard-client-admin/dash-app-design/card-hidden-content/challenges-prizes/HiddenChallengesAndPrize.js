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

    const text = `
        São Dois Modos:
        <br/>
        CONSTANTE E PROGRESSIVO
        <br />
        <br />
        > Constante:
        <br />
        Descrição: Define um único prêmio para
        <br />
        todos os desafios. Ideal se você precisa
        <br />
        de apenas uma opção de prêmio.
        <br />
        Esse é o modo padrão.
        <br />
        <br />
        Exemplo Prático:
        <br />
        - Uma churrascaria que dá um almoço extra para cada desafio concluído.
        <br />
        - Uma academia oferece 1 par de ingressos toda vez que os clientes alcançarem 500 pontos.
        <br />
        <br />
        > Progressivo
        <br />
        Descrição: Define mais opções de prêmios para uma sequência de desafios com metas progressivas. Ideal para uma lista de prêmios. É ativado automaticamente ao adicionar mais desafios.
        <br />
        <br />
        Exemplo Prático: Um salão de beleza oferece 3 prêmios:
        <br />
        - prêmio 1: ganha 1 corte de cabelo unissex
        para 200 pontos.
        <br />
        - prêmio 2: ganha massagem + hidratação para mais 300 pontos. (500 pontos acumulados)
        <br />
        - prêmio 3: ganha corte de cabelo + massage + hidratação para mais 400 pontos (900 pontos acumulados)
        <br />
        <br />
        O cliente que finalizar um desafio, tem sua pontuação atual (fidelidômetro) zerado, porém no seu histórico de compras é acumulativo e sempre registrado
    `

    const showPrizeAndGoalsVisibility = () => {
        return(
            <section className="container-center">
                <section className="position-relative">
                    <header className="mb-3 text-purple font-weight-bold text-subtitle text-center">
                        Revelar prêmios e metas para clientes?
                    </header>
                    <div className="position-absolute" style={styles.visibleInstruBtn}>
                        <InstructionBtn
                            text={text}
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
                        text={text}
                        mode="tooltip"
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