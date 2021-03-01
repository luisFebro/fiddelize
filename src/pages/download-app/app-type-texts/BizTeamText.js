const isSmall = window.Helper.isSmallScreen();
const truncate = (name, leng) => window.Helper.truncate(name, leng);

export default function ClientMemberText({
    txtPColor,
    styles,
    userName,
    ScrollArrow,
    showMainScrollArray,
    primaryAgent,
}) {
    const isBizRep = primaryAgent === "fiddelize";

    return (
        <section
            className={`${
                isSmall ? "ml-2 text-left" : "text-center"
            } mt-4 text-title`}
        >
            <section className="full-height">
                <div className="my-5 container-center">
                    <img
                        src="/img/official-logo-name.png"
                        className="img-fluid"
                        width={200}
                        height={200}
                        title="logo da fiddelize"
                        alt="logo empresa fiddelize"
                    />
                </div>
                <div className="text-center text-hero">
                    <span
                        className="d-block text-title"
                        style={{ lineHeight: "50px" }}
                    >
                        App da Fiddelize
                        <br />
                        para{" "}
                    </span>
                    <div
                        className={`${txtPColor} d-inline-block mt-2 animated bounce repeat-2 delay-3s`}
                        style={styles.hightlighedName}
                    >
                        {userName || "você!"}
                    </div>
                    <div className="pt-1 pb-5">
                        <ScrollArrow margin={50} />
                    </div>
                </div>
            </section>
            <p className="px-2 text-center text-hero" style={{ lineHeight: 1 }}>
                <span>
                    Oi,
                    <br />{" "}
                    {truncate(userName && userName.cap(), isSmall ? 22 : 30)}
                </span>
            </p>
            <div className="mx-2">
                <p>Baixe o app da Fiddelize para começar a ganhar dinheiro.</p>
                <p className="mt-5 download-app--txt">
                    Você ganha tanto com vendas passivas e ativas.
                </p>
                <p className="download-app--txt" style={styles.margin}>
                    Sua comissão é de {isBizRep ? "45" : "30"}% por cada
                    transação de pagamento dos seus clientes. Não somente a
                    primeira!
                </p>
                <p className="download-app--txt" style={styles.margin}>
                    Você recebe no mesmo dia caso o seu cliente pague com PIX,
                    ou até 15 dias com outros meios de pagamentos.
                </p>
                <p className="download-app--txt" style={styles.margin}>
                    Comece a sua missão! Baixe o seu app logo a baixo.
                </p>
                {showMainScrollArray()}
            </div>
        </section>
    );
}
