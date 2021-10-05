import { Fragment, useEffect } from "react";
import useScrollUp from "hooks/scroll/useScrollUp";
import { Load } from "components/code-splitting/LoadableComp";
import { gameIconsStore, gameBrNameStore } from "components/biz/GamesBadge";
import getQueryByName from "utils/string/getQueryByName";
import { removeStore } from "init/var";

export const AsyncTargetPrizePanel = Load({
    loader: () =>
        import(
            "./games/target-prize/TargetPrizePanel" /* webpackChunkName: "game-panel-comp-lazy" */
        ),
});

export const AsyncDiscountBackPanel = Load({
    loader: () =>
        import(
            "./games/discount-back/DiscountBackPanel.js" /* webpackChunkName: "game-panel-comp-lazy" */
        ),
});

export default function ShoppingGamesPanel({ history }) {
    const selectedGame = getQueryByName("g");

    useScrollUp();
    useRemovePriorData();

    const showTitle = () => (
        <div className="text-center text-white my-4">
            <h1 className="text-title">Novo Clube</h1>
        </div>
    );

    const showGameTitle = () => (
        <Fragment>
            <span className="d-block text-normal text-center text-white">
                Jogo selecionado:
            </span>
            <h2 className="container-center">
                <span className="shopping-games-title text-subtitle font-weight-bold text-pill">
                    {gameIconsStore[selectedGame]}
                    <span className="ml-3 d-inline-block">
                        {gameBrNameStore[selectedGame]}
                    </span>
                </span>
                <style jsx>
                    {`
                        .shopping-games-title {
                            background-color: var(--mainWhite);
                            color: var(--themeP);
                        }
                    `}
                </style>
            </h2>
        </Fragment>
    );

    return (
        <Fragment>
            {showTitle()}
            {showGameTitle()}
            {selectedGame === "targetPrize" && (
                <AsyncTargetPrizePanel history={history} />
            )}
            {selectedGame === "discountBack" && (
                <AsyncDiscountBackPanel history={history} />
            )}
        </Fragment>
    );
}

// HOOKS
// prevent prior data conflict with the flow. For instance, the bizForm aciton button didn't work because there was prior data indicating that step has already taken
function useRemovePriorData() {
    useEffect(() => {
        (async () => {
            await Promise.all([
                removeStore("pre_register"),
                removeStore("user"),
            ]);
        })();
    }, []);
}
// END HOOKS

/* ARCHIVES

useAnimateElem(".intro-page--txt", { animaIn: "fadeInUp", speed: "slow" });
useAnimateElem(".intro-page--txt-hero", {
    animaIn: "bounceInUp",
    speed: "slow",
});
useAnimateElem(".intro-page--img-right", {
    animaIn: "backInRight",
    speed: "normal",
});

const showSysExplanation = () => (
    <Fragment>
        <section className="text-white">
            <p
                className="text-center text-subtitle mx-3 mt-5 mb-3"
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
                    Se o cliente comprou R$ 50,
                    <br />
                    ganhou 50 PTS.
                </p>
                <figure className="svg-elevation intro-page--img-right mt-5 mb-3">
                    <img
                        src={`${CLIENT_URL}/img/icons/new-app/pointsEqualCash.svg`}
                        width={270}
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
                <figure className="svg-elevation intro-page--img-right">
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
                className={`intro-page--txt margin-auto-90 text-normal text-left pl-1`}
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
                continuar comprando? Isso, o prêmio é seu investimento de
                Marketing de relacionamento para sua clientela ativa.
                <br />
                <br />
                3) Sai bem mais em conta do que o Marketing para atrair
                novos clientes, afinal você investe com um pedaço dos lucros
                gerados pelo cliente e somente quando sua pontuação é
                batida.
                <br />
                <br />
                4) Por fim, clientes mais satisfeitos são encorajados a
                voltar mais!
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
