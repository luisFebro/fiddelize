import React from "react";
import { ShowTitle, ShowPicture } from "../DefaultProComps";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const getStyles = () => ({
    check: { fontSize: "25px", marginRight: "10px", color: "var(--themeP)" },
    priceBadge: {
        borderRadius: "30px",
        padding: "4px 40px 4px 8px",
        background: "var(--mainDark)",
        color: "#fff",
        textAlign: "center",
        display: "table",
        zIndex: 20,
    },
    discountBadge: {
        right: 25,
        borderRadius: "30px",
        padding: "4px 8px",
        backgroundColor: "var(--mainWhite)",
        textAlign: "center",
        display: "table",
        zIndex: 30,
    },
});

export default function SattisfacaoClientes({ data }) {
    const { normalPrice, discountPrice } = data;

    const styles = getStyles();

    const showMainBenefit = () => (
        <section>
            <p className="mx-3 text-purple text-normal font-weight-bold">
                Use uma métrica eficaz para pesquisa de satisfação dos clientes.
            </p>
        </section>
    );

    const showProposition = () => (
        <section className="mt-5">
            <h2 className="text-subtitle text-center font-weight-bold text-purple">
                Propostas e Ideais
            </h2>
            <p className="text-normal text-purple">
                <FontAwesomeIcon icon="check" style={styles.check} />
                Você terá a mesma ferramenta usada por empresas focadas na
                experiência dos clientes como Apple, Ebay e GE.
            </p>
            <p className="text-normal text-purple">
                <FontAwesomeIcon icon="check" style={styles.check} />A Fiddelize
                vai explorar o potencial do NPS (Net Promoter Score, ou
                pontuação de promotor líquido) para te entregar em tempo real
                como anda a experiência dos seus clientes.
            </p>
            <p className="text-normal text-purple">
                <FontAwesomeIcon icon="check" style={styles.check} />
                Seus clientes vão responder apenas uma pergunta:{" "}
                <strong>Você recomendaria nossa empresa para um amigo?</strong>
                <br />
                <br />
                Após uma extensiva pesquisa feita por executivos, essa pergunta
                foi a mais eficiente porque as pessoas recomendam apenas quando
                estão satisfeitas.
            </p>
            <p className="text-normal text-purple">
                <FontAwesomeIcon icon="check" style={styles.check} />A Fiddelize
                vai usar assim: Após a compra de seus clientes e registrar a
                pontuação, será mostrado uma tela de estrelas para avaliar sua
                experiencia de compra. Logo em seguida, o cliente vai dá uma
                resposta escrita seja elogio, melhorias ou críticas.
            </p>
            <p className="text-normal text-purple">
                <FontAwesomeIcon icon="check" style={styles.check} />
                Toda avaliação negativa, você é notificado em tempo real sobre o
                problema. Assim você pode transformar clientes insatisfeitos em
                fãs!
            </p>
            <p className="text-normal text-purple">
                <FontAwesomeIcon icon="check" style={styles.check} />
                Os clientes vão poder avaliar a cada compra. A última avaliação
                de cada cliente é que será usada.
            </p>
            <p className="text-normal text-purple">
                <FontAwesomeIcon icon="check" style={styles.check} />
                Quer conhecer mais sobre NPS?
                <br />
                <br />
                <a
                    className="text-link"
                    href="https://rockcontent.com/br/blog/nps/"
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    Rock Content - Entenda o que é NPS.
                </a>
                <br />
                <br />
                <a
                    className="text-link"
                    href="https://hbr.org/2003/12/the-one-number-you-need-to-grow"
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    Harvard Business Review - O único número que você precisa
                    aumentar (Inglês)
                </a>
            </p>
            <p className="text-normal text-purple">
                <FontAwesomeIcon icon="check" style={styles.check} />A pesquisa
                de satisfação NPS é simples, eficaz, reconhecida e usada por
                todos os tamanhos de empresas.
            </p>
            <p className="text-normal text-purple">
                <span className="d-block font-weight-bold">
                    Previsão de Lançamento:
                </span>
                20 de Dezembro de 2020.
            </p>
        </section>
    );

    const displayPriceBadge = () => (
        <section className="my-3 d-flex justify-content-center">
            <div
                className="font-weight-bold text-normal"
                style={styles.priceBadge}
            >
                R$ {discountPrice}
            </div>
            <div
                className="position-relative shadow-elevation-black"
                style={styles.discountBadge}
            >
                <span
                    className="font-weight-bold text-grey"
                    style={{ textDecoration: "line-through" }}
                >
                    R$ {normalPrice}
                </span>
            </div>
        </section>
    );

    const showPrice = () => (
        <section className="mt-5">
            <h2 className="text-subtitle text-center font-weight-bold text-purple">
                Preço Investimento Anual
            </h2>
            {displayPriceBadge()}
            <p className="text-normal text-purple">
                Aproveite e ganhe 50% de desconto fixo apenas até o lançamento.
            </p>
        </section>
    );

    return (
        <section className="mx-3">
            {showMainBenefit()}
            {showProposition()}
            {showPrice()}
        </section>
    );
}
