import React from "react";
import { Link } from "react-router-dom";
import Img from "../../../components/Img";

const getStyles = () => ({
    rootCard: {
        background: "var(--themeP)",
        width: "150px",
        height: "auto",
        borderRadius: "20px",
    },
});

export default function AsyncTestModeContent() {
    const styles = getStyles();

    const showClientCard = () => (
        <Link className="no-text-decoration" to="/mobile-app?client-admin=1">
            <section className="shadow-babadoo" style={styles.rootCard}>
                <Img
                    className="mx-5 mt-5 mb-3"
                    src="/img/pro-features/novvos/novvos-clientes.svg"
                    offline={true}
                    width="120px"
                    height="auto"
                    alt="serviço novvos clientes"
                />
                <div className="pb-3 text-nowrap text-center text-normal text-white font-weight-bold">
                    App
                    <br />
                    Cliente
                </div>
            </section>
        </Link>
    );

    const showTeamCard = () => (
        <Link className="no-text-decoration" to="/t/app/equipe?modo-prev=1">
            <section className="shadow-babadoo" style={styles.rootCard}>
                <Img
                    className="mx-5 mt-5 mb-3"
                    src="/img/pro-features/novvos/novvos-membros.svg"
                    offline={true}
                    width="120px"
                    height="auto"
                    alt="serviço novvos membros"
                />
                <div className="pb-3 text-nowrap text-center text-normal text-white font-weight-bold">
                    App
                    <br />
                    Equipe
                </div>
            </section>
        </Link>
    );

    return (
        <section style={{ marginTop: 100 }}>
            <h1 className="mb-5 text-subtitle text-purple text-center font-weight-bold">
                Qual app para ver
                <br />
                no modo teste?
            </h1>
            <section className="mt-3 animated fadeInUp delay-1s container-center">
                <div className="mr-3">{showClientCard()}</div>
                {showTeamCard()}
            </section>
        </section>
    );
}
