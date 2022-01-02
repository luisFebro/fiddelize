import { Fragment } from "react";
import FaqAccordion from "components/expansion-panels/faq/FaqAccordion";
// import { useBizData } from "init";

export default function BalloonPopFaq() {
    // const { bizLinkName } = useBizData();

    const dataArray = [
        {
            title: "O cliente precisa de pontos ou cadastro para participar?",
            text: (
                <Fragment>
                    <p className="text-break">
                        Não precisa porque basta o cliente acessar o seu link,
                        estourar um balão e seu negócio entrega o benefício
                        instantâneo que ele tirar.
                    </p>
                </Fragment>
            ),
        },
        {
            title: "Quantos balões ficam disponíveis?",
            text: (
                <Fragment>
                    <p>
                        Nesta versão, ficam disponíveis sempre 9 balões,
                        organizados de forma aleatória toda vez que a página é
                        recarregada.
                    </p>
                </Fragment>
            ),
        },
        {
            title: "Como os benefícios são destribuidos entre os balões?",
            text: (
                <Fragment>
                    <p>
                        A Fiddelize organiza, de forma aleatória, seus
                        benefícios adicionados. E também cuida de dividir em
                        quantidade iguais para cada tipo de benefício.
                    </p>
                    <p>
                        Por exemplo, o máximo de balões que aparece no
                        dispositivo do cliente é até 9 balões. Se você adicionou
                        3 tipos de benefícios, fica 3 balões para cada
                        benefício.
                    </p>
                    <p>
                        Se ficar sobrando balão, o seu último benefício fica com
                        mais balões. Por exemplo: adicionou 2 benefícios, o
                        primeiro fica com 4 balões e, o último, com 5 deles no
                        total de 9.
                    </p>
                </Fragment>
            ),
        },
        {
            title: "Quantos benefícios diferentes posso adicionar?",
            text: (
                <Fragment>
                    <p>
                        É preciso de, no mínimo, <strong>dois tipos</strong> de
                        benefícios e no máximo <strong>nove benefícios</strong>,
                        ou seja, 9 balões que aparecerá na tela do seu cliente.
                    </p>
                </Fragment>
            ),
        },
        {
            title:
                "Como me certifico que o cliente só estoure um balão por compra?",
            text: (
                <Fragment>
                    <p>
                        Por padrão, após o cliente estourar um balão, o
                        benefício fica revelado e fixado na tela mesmo se
                        recarregar e limpar a memória da página durante{" "}
                        <strong>meia hora</strong> para prevenir múltiplas
                        tentativas de estourar outros balões.
                    </p>
                </Fragment>
            ),
        },
    ];

    return (
        <Fragment>
            <h2 className="text-subtitle text-center font-weight-bold">
                Perguntas Frequentes
            </h2>
            <FaqAccordion dataArray={dataArray} lazyLoading />
        </Fragment>
    );
}

/* MODEL

{
    title: "Qual é a ordem que os clientes fazem os desafios?",
    text: (
        <Fragment>
            <p>
                É em <strong>ordem decrescente</strong>, feito de acordo
                com ordem dos tipo (tipo 1, tipo 2, etc). Quando seu
                cliente bate sua meta e recebe um benefício, o próximo
                desafio da lista inicia automaticamente.
            </p>
            <p>
                Na Fiddelize, é usado dois contadores de desafio:
                <br />
                <strong>- tipo de desafio:</strong> permite você variar
                entre os desafios.
                <br />
                <strong>- edição do desafio:</strong> indica para seu
                cliente quantos desafios conseguiu completar,
                independente do tipo.
            </p>
            <p>
                Por exemplo, você pode ter apenas 1 tipo de desafio na
                sua lista, mas um cliente pode está na edição número 5
                se ele concluiu este mesmo desafio 5 vezes.
            </p>
            <img
                className="my-4 img-center shadow-babadoo"
                width={300}
                src="/img/demos/qa-chall-list/img-3.png"
                alt="cliente na edição 5 do desafio prêmio alvo"
            />
            <p>
                Por fim, pelo menos um jogo de compra e um desafio deve
                está ativo.
            </p>
        </Fragment>
    ),
},


 */
