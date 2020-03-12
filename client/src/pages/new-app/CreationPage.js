import React, { Fragment } from 'react';
import CarouselSlick from '../../components/carousels/CarouselSlick';
import getQueryByName from '../../utils/string/getQueryByName';
import ScrollArrow from '../../keyframes/built/scroll-arrow/ScrollArrow';
import parse from 'html-react-parser';
import AOS from 'aos';
import { CLIENT_URL } from '../../config/clientUrl';
import GoalForm from './GoalForm';

const isSmall = window.Helper.isSmallScreen();
const truncate = (name, leng) => window.Helper.truncate(name, leng);

export default function CreationPage({ location }) {
    const name = getQueryByName("name", location.search).cap();
    const bizName = getQueryByName("bizName", location.search).cap();
    // const userId = getQueryByName("userId", location.search).cap();

    const styles = {
        confettiIcon: {
            fontSize: '3rem',
            fontWeight: 'bold',
        }

    }

    AOS.init({
        offset: 50,
    });

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
                <p className="my-1" data-aos="fade-up" data-aos-delay="150">{parse(`Seja ${isSmall ? "<br />" : ""} bem-vindo(a)!`)}</p>
                <div className="pt-1 pb-5">
                    <ScrollArrow margin={50} />
                </div>
                <p className="my-3" data-aos="fade-up">
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
                data-aos-delay="15000"
            >
                <p
                    className="text-center text-subtitle ml-3 mt-5 mb-3"
                    data-aos="fade-up"
                    style={{marginTop: '50px'}}
                >
                    &#187; {name}, nosso <strong>sistema de pontuação</strong> é simples:
                </p>
                <div
                    className="text-normal container-center"
                    data-aos-delay="4000"
                >
                    <p
                        style={{maxWidth: '400px'}}
                        data-aos="zoom-in-right"
                        data-aos-duration="2500"
                        className={`${isSmall && "ml-3"}`}
                    >
                        Cada Ponto é igual ao valor de compra.
                        <br />
                        Seu cliente comprou R$ 50,<br/>ganhou 50 pontos.
                    </p>
                    <figure
                        style={styles.coinsEqualMoneyIcon}
                        className="svg-elevation"
                        data-aos="zoom-in-left"
                        data-aos-duration="2500"
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
                data-aos-delay="15000"
            >
                <p
                    className="text-center text-subtitle ml-3 mt-5 mb-3"
                    data-aos="fade-up"
                >
                    <strong>Você estipula o ponto de recompensa:</strong>
                </p>
                <div
                    className="text-normal container-center"
                    data-aos-delay="4000"
                >
                    <p
                        style={{maxWidth: '400px'}}
                        data-aos="zoom-in-right"
                        data-aos-duration="2500"
                        className={`${isSmall && "ml-3"}`}
                    >
                        Quando seu cliente atingir esse ponto,
                        <br />
                        você entrega um <strong>prêmio simbólico</strong>.
                        <br />
                        Ex: Atingiu 100 pontos, ganhou tal serviço, produto, benefício ou desconto.
                        Você escolhe!
                    </p>
                    <figure
                        style={styles.coinsEqualMoneyIcon}
                        className="svg-elevation"
                        data-aos="zoom-in-left"
                        data-aos-duration="2500"
                    >
                        <img
                            src={`${CLIENT_URL}/img/icons/official-gift-bag.svg`}
                            width={200}
                            height="auto"
                            alt="ponto igual a valor de compra"
                        />
                    </figure>
                </div>
                <div style={{marginTop: '50px'}} className={`margin-auto-80 text-subtitle ${isSmall ? "text-left pl-1" : "text-center"}`} data-aos="zoom-in-left" data-aos-duration="2500">
                    <strong>Por que um prêmio?</strong><br />Além de valorizar as compras dos clientes, todos gostam de um desafio com um prêmio em mente, incluindo seus clientes.
                    <br/>
                    Um cliente satisfeito e recompensado, volta ainda mais vezes.
                </div>
                <div style={{marginTop: '90px'}} className="text-hero text-center" data-aos="zoom-in-left" data-aos-duration="2500">
                    Ok, agora vamos começar!
                </div>
            </section>
        </Fragment>
    );

    const showGoalForm = () => (
        <GoalForm />
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
<CarouselSlick />
*/