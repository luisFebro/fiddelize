import {
    ShowTitle,
    ShowPicture,
    ShowArticleTitle,
    textStyle,
    useElemShowOnScroll,
} from "../DefaultArticleComps";

const Body = () => {
    const opts = {
        withObserver: true,
        loadImgs: true,
        imgWrapper: true,
    };
    useElemShowOnScroll(".challenge-modes--picture", opts);

    return (
        <article style={{ position: "relative" }} className={textStyle}>
            <p>
                Conquistar clientes e fazer eles retornarem ao seu negócio está
                cada vez mais importante em um mundo cheio de mudanças.
            </p>
            <p>
                Uma forma comprovada pelo mercado e oferecido pela Fiddelize é
                um jogo de compra que vai ajudar você nesta conquista oferecendo
                um diferencial a mais que seus clientes certamente ficarão
                interessados: prêmio ao atingir determinada quantidade em pontos
                de compra.
            </p>
            <h3 className="my-3 font-site text-purple">Desafios:</h3>
            <p>
                Cada edição onde o seu cliente busca alcançar um prêmio
                acumulando a moeda PTS ou pontos de compra é chamado de desafio
                na Fiddelize. Assim fica fácil de saber em qual edição do jogo
                eles estão ou saberem seu histórico.
            </p>
            <ShowPicture
                imgContainerClass="challenge-modes--picture"
                dataSrc="/img/articles/challenge-modes/pic-1.png"
                reference=""
                subtitle="adicionando prêmios"
            />
            <h3 className="my-3 font-site text-purple">Prêmios:</h3>
            <p>
                Você pode personalizar e adicionar um ou mais prêmios de acordo
                com sua estratégia comercial. A maior parte dos negócios
                oferecerem apenas um prêmio, mas suas possibilidades na
                Fiddelize te permite criar <strong>múltiplos prêmios</strong>
            </p>

            <p>
                Alguns exemplos práticos de único prêmio:
                <br />- Uma churrascaria que oferece um almoço extra para cada
                desafio concluído.
                <br />- Uma academia oferece 1 par de ingressos toda vez que os
                clientes alcançarem 800 PTS.
            </p>
            <p>
                Exemplo prático de negócio oferendo diferentes prêmios:
                <br />
                Um salão de beleza oferece 3 prêmios.
            </p>
            <p>
                <strong>- prêmio 1:</strong> ganha 1 corte de cabelo unissex
                para meta de 400 PTS no desafio N.º 1
            </p>
            <p>
                <strong>- prêmio 2:</strong> ganha massagem + hidratação para
                meta de 600 PTS no desafio N.º 2
            </p>
            <p>
                <strong>- prêmio 3:</strong> ganha corte de cabelo + massagem +
                hidratação para meta de 1.000 PTS no desafio N.º 3.
            </p>
            <br />
            <p>
                Note que os valores das metas vão ficando maiores ou usam uma
                abordagem progressiva para cada nova edição de desafio. Mas você
                pode seguir outras estratégias como só mudar os prêmios mas com
                valores das metas iguais ou similares. Ou mesmo metas menores
                que anteriores.
            </p>
            <p>
                Você deve se perguntar o que acontece quando o cliente atingir o
                último prêmio, qual será o próximo? Bom, a resposta é simples: o
                último prêmio adicionado na lista junto com a meta em pontos e
                ícone de desafio é{" "}
                <strong>
                    repetido para todas os demais desafios do cliente.
                </strong>
            </p>
            <p>
                O cliente que finalizar um desafio, tem sua pontuação atual
                zerada, porém no seu <strong>histórico de compras</strong> é
                acumulativo e sempre registrado.
            </p>
            <p>
                No App do cliente também tem um{" "}
                <strong>histórico de benefícios</strong> onde ficam registrados
                as conquistas dos seus clientes de todos os jogos incluindo o
                prêmio alvo.
            </p>

            <ShowPicture
                imgContainerClass="challenge-modes--picture"
                dataSrc="/img/articles/challenge-modes/pic-3.png"
                reference=""
                subtitle="galeria de benefícios do cliente"
            />

            <p>
                O legal é que cada cliente avançar no seu ritmo de compra que a
                Fiddelize registra e mostra quais os prêmios e pontos de cada
                desafio de forma individual e personalizada.
            </p>
            <h3 className="my-3 font-site text-purple">Ícone de desafios:</h3>
            <p>
                Ah! E você pode <strong>personalizar o ícone</strong> de cada
                desafio. Escolha o que mais combina para o seu negócio ou
                prêmios oferecidos.
            </p>

            <ShowPicture
                imgContainerClass="challenge-modes--picture"
                dataSrc="/img/articles/challenge-modes/pic-4.png"
                reference=""
                subtitle="seleção ícone"
            />
            <br />
            <br />
            <ShowPicture
                imgContainerClass="challenge-modes--picture"
                dataSrc="/img/articles/challenge-modes/pic-5.png"
                reference=""
                subtitle="ícone no app do cliente no jogo prêmio alvo"
            />
        </article>
    );
};

export default function Article() {
    return (
        <section>
            <ShowTitle title="Fiddelize Ensina" />
            <ShowArticleTitle title="Como o Jogo de Prêmio Alvo pode ajudar a conquistar seus clientes?" />
            <ShowPicture
                src="/img/articles/challenge-modes/main.jpg"
                timeout={2000}
                reference="pexels.com"
                main
            />
            <Body />
        </section>
    );
}
