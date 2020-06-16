import React, { Fragment } from 'react';
import getQueryByName from '../../utils/string/getQueryByName';
import ScrollArrow from '../../keyframes/built/scroll-arrow/ScrollArrow';
import parse from 'html-react-parser';
import { CLIENT_URL } from '../../config/clientUrl';
import GoalForm from './GoalForm';
import useAnimateElem from '../../hooks/scroll/useAnimateElem';

const isSmall = window.Helper.isSmallScreen();
const truncate = (name, leng) => window.Helper.truncate(name, leng);

export default function CreationPage({ location, match }) {
    const name = getQueryByName("name", location.search).cap();
    const bizName = getQueryByName("bizName", location.search).cap();
    const bizCodeName = match.params.bizCodeName;
    const id = getQueryByName("id", location.search);

    useAnimateElem(".intro-page--txt", {animaIn: "fadeInUp", speed: "slow" });
    useAnimateElem(".intro-page--txt-hero", {animaIn: "bounceInUp", speed: "slow" });
    useAnimateElem(".intro-page--img-right", {animaIn: "backInRight", speed: "normal" });

    const styles = {
        confettiIcon: {
            fontSize: '3rem',
            fontWeight: 'bold',
        }

    }

    const showWelcomeIntro = () => (
        <section className="text-white text-title">
            <p
                className={`pl-3 text-center text-hero`}
                style={{lineHeight: 1}}
            >
                Oi,
                <br />
                {truncate(name, isSmall ? 22 : 30)}
            </p>
            <div className="ml-2 text-center">
                <p>Cadastro realizado! <i style={styles.confettiIcon}>🎉</i></p>
                <p className="intro-page--txt my-1">{parse(`Seja ${isSmall ? "<br />" : ""} bem-vindo(a)!`)}</p>
                <div className="pt-1 pb-5">
                    <ScrollArrow margin={50} />
                </div>
                <p className="intro-page--txt my-3">
                    Vamos criar o
                    <br />
                    novo APP da {bizName}
                    <br />
                    no seu estilo.
                </p>
            </div>
        </section>
    );

    const showSysExplanation = () => (
        <Fragment>
            <section
                className="text-white"
            >
                <p
                    className="intro-page--txt text-center text-subtitle ml-3 mt-5 mb-3"
                    style={{marginTop: '50px'}}
                >
                    &#187; {name}, nosso <strong>sistema de pontuação</strong> é simples:
                </p>
                <div
                    className="text-normal container-center"
                >
                    <p
                        style={{maxWidth: '400px'}}
                        className={`${isSmall && "ml-3"} intro-page--txt`}
                    >
                        Cada Ponto é igual ao valor de compra.
                        <br />
                        <br />
                        Seu cliente comprou R$ 50,<br/>ganhou 50 pontos.
                    </p>
                    <figure
                        style={styles.coinsEqualMoneyIcon}
                        className="svg-elevation intro-page--img-right"
                    >
                        <img
                            src={`${CLIENT_URL}/img/icons/coinEqualMoney.svg`}
                            width={200}
                            height="auto"
                            alt="ponto igual a valor de compra"
                        />
                    </figure>
                </div>
            </section>
            <section
                style={{marginTop: '50px'}}
                className="text-white"
            >
                <p
                    className="intro-page--txt text-center text-subtitle ml-3 mt-5 mb-3"
                >
                    <strong>Você estipula o ponto de prêmio:</strong>
                </p>
                <div
                    className="text-normal container-center"
                >
                    <p
                        style={{maxWidth: '400px'}}
                        className={`${isSmall && "ml-3"} intro-page--txt`}
                    >
                        Quando seu cliente atingir esse ponto,
                        <br />
                        você entrega um <strong>prêmio simbólico</strong>.
                        <br />
                        <br />
                        Ex: Atingiu 100 pontos, ganhou tal serviço, produto, benefício ou desconto.
                        Você escolhe!
                    </p>
                    <figure
                        style={styles.coinsEqualMoneyIcon}
                        className="svg-elevation intro-page--img-right"
                    >
                        <img
                            src={`${CLIENT_URL}/img/icons/official-gift-bag.svg`}
                            width={200}
                            height="auto"
                            alt="ponto igual a valor de compra"
                        />
                    </figure>
                </div>
                <div style={{marginTop: '50px'}} className={`intro-page--txt margin-auto-80 text-subtitle ${isSmall ? "text-left pl-1" : "text-center"}`}>
                    <strong>Por que um prêmio?</strong><br />Além de valorizar as compras dos clientes, todos gostam de um desafio com um prêmio em mente, incluindo seus clientes.
                    <br/>
                    <br/>
                    Um cliente satisfeito e recompensado, volta ainda mais vezes.
                </div>
                <div style={{marginTop: '90px'}} className="intro-page--txt-hero text-hero text-center">
                    Ok, agora vamos começar!
                </div>
            </section>
        </Fragment>
    );

    const showGoalForm = () => (
        <GoalForm
            userId={id}
            bizName={bizName}
            bizCodeName={bizCodeName}
            bizId={id}
            name={name}
        />
    );

    return (
        <Fragment>
            {showWelcomeIntro()}
            {showSysExplanation()}
            {showGoalForm()}
        </Fragment>
    );
}

/*ARCHIVES
<div className="text-title text-white text-center">
    Qual é o prêmio que seu cliente ganha após atingir os objetivos em pontos
</div>
<div className="text-title text-white text-center">
    Selecione a principal cor da sua empresa.
</div>
*/