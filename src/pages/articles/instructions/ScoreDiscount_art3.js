import {
    ShowTitle,
    ShowPicture,
    ShowArticleTitle,
    textStyle,
    useElemShowOnScroll,
} from "../DefaultArticleComps";
/*
title; <h3 className="my-3 font-site text-purple">
 */

const Body = () => {
    const opts = {
        withObserver: true,
        loadImgs: true,
        imgWrapper: true,
    };
    useElemShowOnScroll(".score-discount--picture", opts);

    return (
        <article style={{ position: "relative" }} className={textStyle}>
            <p>
                A Fiddelize oferece as maneiras mais práticas e rápidas do
                mercado de não apenas adicionar moedas digitais, ou pontos, em
                segundos mas também de descontá-las após seus clientes receberem
                algum benefício para assim facilitar e agilizar a missão dos
                heróis e heroínas do mercado de conquistar a preferência de seus
                clientes.
            </p>

            <p>
                E mais, sua equipe pode te ajudar para adicionar e descontar
                moedas digitais e aproveitar a força colaborativa entre apps com
                total transparência e segurança refinada.
            </p>

            <ShowPicture
                imgContainerClass="score-discount--picture"
                dataSrc="/img/articles/score-discount/pic-1-a.png"
                reference=""
                subtitle="app cliente - jogo de compra prêmio alvo: exemplo de design após finalizar meta"
            />

            <p>
                Primeiramente, seus clientes sabem de forma clara e com uma
                notificação de que eles finalizam um desafio e estão{" "}
                <strong>aptos a receber algum benefício</strong>.
            </p>

            <ShowPicture
                imgContainerClass="score-discount--picture"
                dataSrc="/img/articles/score-discount/pic-1-b.png"
                reference=""
                subtitle="comprovante digital com código QR"
            />

            <p>
                Daí, ao final de cada edição de um jogo, eles recebem um
                comprovante digital. E aqui entra a praticidade! Você ou sua
                equipe pode descontar as moedas digitais de{" "}
                <strong>3 formas práticas</strong>: Basta escanear com{" "}
                <strong>código QR</strong>, ou{" "}
                <strong>pesquisar pelo nome</strong> do cliente, ou ainda
                simplesmente <strong>procurar na lista</strong> de clientes com
                benefícios pendentes.
            </p>

            <ShowPicture
                imgContainerClass="score-discount--picture"
                dataSrc="/img/articles/score-discount/pic-2.png"
                reference=""
                subtitle="benefícios da clientela em um só lugar"
            />

            <ShowPicture
                imgContainerClass="score-discount--picture"
                dataSrc="/img/articles/score-discount/pic-3.png"
                reference=""
                subtitle="cartão de benefício do cliente"
            />

            <ShowPicture
                imgContainerClass="score-discount--picture"
                dataSrc="/img/articles/score-discount/pic-4.png"
                reference=""
                subtitle="confirme entrega de benefício e desconte moedas digitais dos clientes com um clique."
            />

            <p>
                Note que a Fiddelize automaticamente calcula o saldo do cliente
                e caso fique sobrando algum, credita automaticamente para
                próxima edição ou desafio. No histórico de compras fica
                registrado <strong>todas as pontuações do cliente</strong> desde
                a sua primeira compra.
            </p>

            <ShowPicture
                imgContainerClass="score-discount--picture"
                dataSrc="/img/articles/score-discount/pic-5.png"
                reference=""
                subtitle="app admin - ações rápidas com acesso aos benefícios"
            />

            <p>
                Você tem acesso rápido à área de benefícios da cliente logo após
                acessar sua conta no botão de ações rápidas.
            </p>

            <p>
                Em resumo, você tem todos os benefícios pendentes ou que já
                foram entregues em um só lugar, tudo em tempo real e
                sincronizado com sua equipe sem precisar se preocupar quais
                clientes precisam receber ou se já receberam algum benefício. É
                o próximo nível para simplificar a gestão de benefícios do seu
                clube de compras!
            </p>
        </article>
    );
};

export default function Article() {
    return (
        <section>
            <ShowTitle title="Fiddelize Ensina" />
            <ShowArticleTitle title="Como descontar moedas quando cliente conclui um desafio?" />
            <ShowPicture
                src="/img/articles/score-discount/main.jpg"
                timeout={2000}
                reference="pexels.com"
                main
            />
            <Body />
        </section>
    );
}
