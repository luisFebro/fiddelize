import React, { Fragment } from "react";

const isSmall = window.Helper.isSmallScreen();
const truncate = (name, leng) => window.Helper.truncate(name, leng);

export default function ClientMemberText({
    bizLogo,
    bizName,
    txtPColor,
    styles,
    userName,
    ScrollArrow,
    showMainScrollArray,
}) {
    return (
        <section
            className={`${
                isSmall ? "ml-2 text-left" : "text-center"
            } mt-4 text-title`}
        >
            <section className="full-height">
                <div className="my-5 container-center">
                    <img
                        src={
                            bizLogo === "undefined"
                                ? `/img/official-logo-name.png`
                                : bizLogo
                        }
                        className="img-fluid"
                        width={bizLogo === "undefined" && 200}
                        height={bizLogo === "undefined" && 200}
                        title={`logo da ${bizName}`}
                        alt={`logo empresa ${bizName}`}
                    />
                </div>
                <div className="text-center text-hero">
                    <span
                        className="d-block text-title"
                        style={{ lineHeight: "50px" }}
                    >
                        Novo app da equipe
                        <br />
                        para{" "}
                    </span>
                    <div
                        className={`${txtPColor} d-inline-block mt-2 animated bounce repeat-2 delay-3s`}
                        style={styles.hightlighedName}
                    >
                        {userName ? userName : "você!"}
                    </div>
                    <div className="pt-1 pb-5">
                        <ScrollArrow margin={50} />
                    </div>
                </div>
            </section>
            <p
                className={`px-2 text-center text-hero`}
                style={{ lineHeight: 1 }}
            >
                <span>
                    Oi,
                    <br />{" "}
                    {truncate(userName && userName.cap(), isSmall ? 22 : 30)}
                </span>
            </p>
            <div className="mx-2">
                <p>Baixe a nova ferramenta de pontos de fidelidade da</p>
                <p className="text-hero text-center">
                    {bizName && bizName.cap()}
                </p>
                <p className="mt-5 download-app--txt">
                    A missão é simples: cadastrar pontos e novos clientes.
                </p>
                <p className="download-app--txt" style={styles.margin}>
                    Você está convocado(a) como guardiã(o) dos pontos da{" "}
                    {bizName && bizName.cap()}! (=
                </p>
                <p className="download-app--txt" style={styles.margin}>
                    Seu app leva em conta a eficiência do processo de compras.
                </p>
                <p className="download-app--txt" style={styles.margin}>
                    Basta enviar o link de cadastro para os clientes, eles
                    baixam o app, fazem o cadastro e começam a receber pontos.
                    <br />
                    <br />
                    Cadastre os pontos em menos de 1 minuto. Os clientes recebem
                    direto no app deles em tempo real.
                </p>
                <p className="download-app--txt" style={styles.margin}>
                    Comece a usar! Baixe o seu app logo a baixo.
                </p>
                {showMainScrollArray()}
            </div>
        </section>
    );
}
