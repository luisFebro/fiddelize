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
                Cada etapa onde o seu cliente busca alcançar um prêmio com
                pontos de compras é chamado de desafio na Fiddelize.
                <strong> São dois os tipos: constante e progressivo.</strong>
            </p>

            <ShowPicture
                imgContainerClass="challenge-modes--picture"
                dataSrc="/img/articles/challenge-modes/pic-1.png"
                reference=""
                subtitle="modo constante"
            />

            <h3 className="my-3 font-site text-purple">Modo constante</h3>

            <p>
                Define um <strong>único prêmio</strong> para todos os desafios.
                Ideal se você precisa de apenas uma opção de prêmio. Esse é o
                modo padrão.
            </p>

            <p>
                Exemplos práticos do modo constante:
                <br />- Uma churrascaria que oferece um almoço extra para cada
                desafio concluído.
                <br />- Uma academia oferece 1 par de ingressos toda vez que os
                clientes alcançarem 500 pontos.
            </p>

            <h3 className="my-3 font-site text-purple">Modo progressivo</h3>

            <ShowPicture
                imgContainerClass="challenge-modes--picture"
                dataSrc="/img/articles/challenge-modes/pic-2.png"
                reference=""
                subtitle="modo progressivo"
            />

            <p>
                Define <strong>mais opções de prêmios</strong> para uma
                sequência de desafios com metas progressivas. Ideal para uma
                lista de prêmios. É ativado automaticamente ao adicionar mais
                desafios.
            </p>

            <p>
                Exemplo prático do modo progressivo: Um salão de beleza oferece
                3 prêmios.
            </p>
            <p>- prêmio 1: ganha 1 corte de cabelo unissex para 200 pontos.</p>
            <p>
                - prêmio 2: ganha massagem + hidratação para mais 300 pontos.
                (500 pontos acumulados)
            </p>
            <p>
                - prêmio 3: ganha corte de cabelo + massage + hidratação para
                mais 400 pontos (900 pontos acumulados).
            </p>
            <br />
            <p>
                O cliente que finalizar um desafio, tem sua pontuação atual
                zerada, porém no seu histórico de compras é acumulativo e sempre
                registrado.
            </p>

            <p>
                O legal é que cada cliente pode avançar do seu ritmo de compra
                que a Fiddelize registra e mostra quais os prêmios e pontos de
                cada desafio de forma individual e personalizada, além de que
                todos os pontos são registrados no histórico de compras
                automático.
            </p>

            <ShowPicture
                imgContainerClass="challenge-modes--picture"
                dataSrc="/img/articles/challenge-modes/pic-3.png"
                reference=""
                subtitle="modo progressivo"
            />

            <p>
                Para mais informações e regras, veja as NOTAS logo abaixo do
                último card desta sessão de desafios e prêmios.
            </p>

            <p>
                Ah! E você pode <strong>personalizar o ícone</strong> de cada
                desafio. Escolha o que mais combina para o seu negócio.
            </p>

            <ShowPicture
                imgContainerClass="challenge-modes--picture"
                dataSrc="/img/articles/challenge-modes/pic-4.png"
                reference=""
                subtitle="modo progressivo"
            />
        </article>
    );
};

export default function Article() {
    return (
        <section>
            <ShowTitle title="Fiddelize Ensina" />
            <ShowArticleTitle title="Dois Modos de Desafios" />
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
