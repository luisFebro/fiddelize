import React, { Fragment } from "react";
import getQueryByName from "../../../utils/string/getQueryByName";
import ScrollArrow from "../../../keyframes/built/scroll-arrow/ScrollArrow";
import parse from "html-react-parser";
import { CLIENT_URL } from "../../../config/clientUrl";
import GoalForm from "./GoalForm";
import useAnimateElem from "../../../hooks/scroll/useAnimateElem";

const isSmall = window.Helper.isSmallScreen();
const truncate = (name, leng) => window.Helper.truncate(name, leng);

const styles = {
    confettiIcon: {
        fontSize: "3rem",
        fontWeight: "bold",
    },
};

export default function RewardPlanner({ location, match }) {
    const name = "Ana Teste"; //getQueryByName("name", location.search).cap();
    const bizName = "Some biz"; //getQueryByName("bizName", location.search).cap();
    const bizCodeName = match.params.bizCodeName;
    const id = getQueryByName("id", location.search);

    useAnimateElem(".intro-page--txt", { animaIn: "fadeInUp", speed: "slow" });
    useAnimateElem(".intro-page--txt-hero", {
        animaIn: "bounceInUp",
        speed: "slow",
    });
    useAnimateElem(".intro-page--img-right", {
        animaIn: "backInRight",
        speed: "normal",
    });

    const showTitle = () => (
        <div className="text-center text-white my-4">
            <h1 className="text-title">Novo App</h1>
            <p className="text-white text-normal mx-3 mb-5">
                Ótimo! Antes de criar seu app, entenda rapidamente sobre pontos
                e prêmios.
            </p>
        </div>
    );

    const showSysExplanation = () => (
        <Fragment>
            <section className="text-white">
                <p
                    className="intro-page--txt text-center text-subtitle mx-3 mt-5 mb-3"
                    style={{ marginTop: "50px" }}
                >
                    &#187; Nosso <strong>sistema de pontuação</strong> é simples
                    e intuitivo:
                </p>
                <div className="text-normal container-center">
                    <p
                        style={{ maxWidth: "400px" }}
                        className={`${isSmall && "mx-3"} intro-page--txt`}
                    >
                        Cada Ponto é igual ao valor de compra.
                        <br />
                        <br />
                        Seu cliente comprou R$ 50,
                        <br />
                        ganhou 50 pontos.
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
            <section style={{ marginTop: "50px" }} className="text-white">
                <p className="intro-page--txt text-center text-subtitle mx-3 mt-5 mb-3">
                    <strong>Você estipula o ponto de prêmio:</strong>
                </p>
                <div className="text-normal container-center">
                    <p
                        style={{ maxWidth: "400px" }}
                        className={`${isSmall && "mx-3"} intro-page--txt`}
                    >
                        Quando seu cliente atingir esse ponto,
                        <br />
                        você entrega um <strong>prêmio simbólico</strong>.
                        <br />
                        <br />
                        Exemplo: Atingiu 500 pontos, ganhou tal serviço,
                        produto, benefício, exclusividade ou desconto. Você
                        escolhe!
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
                <div
                    style={{ marginTop: "50px" }}
                    className={`intro-page--txt margin-auto-90 text-normal ${
                        isSmall ? "text-left pl-1" : "text-center"
                    }`}
                >
                    <strong>4 Motivos de um prêmio</strong>
                    <br />
                    1) Além de valorizar as compras dos clientes, todos gostam
                    de um desafio com um prêmio em mente, incluindo seus
                    clientes.
                    <br />
                    <br />
                    2) Muito se fala em atrair clientes com Marketing, mas já
                    pensou em suas estratégias de estimular os clientes a
                    continuar comprando? Poiser, o prêmio é seu investimento de
                    Marketing interno para sua clientela ativa.
                    <br />
                    <br />
                    3) Sai bem mais em conta do que o Marketing para atrair
                    novos clientes, afinal você investe com um pedaço dos lucros
                    gerados pelo cliente e somente quando sua pontuação é
                    batida.
                    <br />
                    <br />
                    4) Por fim, clientes mais satisfeitos são encorajados a
                    voltar mais. Seu negócio agradece!
                </div>
                <div
                    style={{ marginTop: "90px" }}
                    className="intro-page--txt-hero text-hero text-center"
                >
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
            {showTitle()}
            {showSysExplanation()}
            {showGoalForm()}
        </Fragment>
    );
}

/* ARCHIVES
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
{showWelcomeIntro()}
 */
