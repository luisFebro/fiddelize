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

export default function CoppiaSeguranca({ data }) {
    const { normalPrice, discountPrice } = data;

    const styles = getStyles();

    const showMainBenefit = () => (
        <section>
            <p className="mx-3 text-purple text-normal font-weight-bold">
                Tenha controle do fluxo de cadastros dos clientes. Baixe os
                cadastros deles para arquivo Excel.
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
                Baixe <strong>manualmente</strong> a qualquer momento no popular
                formato Excel.
            </p>
            <p className="text-normal text-purple">
                <FontAwesomeIcon icon="check" style={styles.check} />
                Ou melhor, a Fiddelize vai baixar{" "}
                <strong>automaticamente</strong> nos bastidores uma cópia para
                você semanalmente.
            </p>
            <p className="text-normal text-purple">
                <span className="d-block font-weight-bold">
                    Previsão de Lançamento:
                </span>
                30 de Novembro de 2020.
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
