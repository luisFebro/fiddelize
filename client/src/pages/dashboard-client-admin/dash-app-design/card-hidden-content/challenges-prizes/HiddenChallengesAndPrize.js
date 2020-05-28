import React, { useState } from 'react';
import Title from '../../../../../components/Title';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonFab from '../../../../../components/buttons/material-ui/ButtonFab';
import InstructionBtn from '../../../../../components/buttons/InstructionBtn';
import List from './List.js';
import uuidv1 from 'uuid/v1';
// import

export default function HiddenGoalsAndRewards() {
    const [mode, setMode] = useState("Constante");
    const [needAdd, setNeedAdd] = useState('');
    const [hideAddBtn, setHideAddBtn] = useState(false);

    const styles = {
        iconPos: {
            top: 0,
            right: -50,
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

    const showTitle = () => (
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
                    />
                </div>
            </section>
        </div>
    );

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

    return (
        <div className="hidden-content--root text-normal">
            {showTitle()}
            <List
                setMode={setMode}
                setHideAddBtn={setHideAddBtn}
                mode={mode}
                needAdd={needAdd}
            />
            {showBtnAction()}
        </div>
    );
}