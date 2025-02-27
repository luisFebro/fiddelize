import removeImgFormat from "../../../utils/biz/removeImgFormat";

const isSmall = window.Helper.isSmallScreen();
const truncate = (name, leng) => window.Helper.truncate(name, leng);

export default function ClientUserText({
    bizLogo,
    bizName,
    txtPColor,
    userName,
    styles,
    ScrollArrow,
    showMainScrollArray,
}) {
    const { newImg: thisBizLogo, width, height } = removeImgFormat(bizLogo);

    // Update this with Picture Comp and lazy loading effect: fadeInBottomLeft
    const showAppShowCase = () => (
        <div
            style={{
                maxWidth: 800,
                position: "relative",
                left: isSmall ? "-135px" : "-249px",
            }}
        >
            <img
                className="img-fluid shape-elevation"
                src="/img/illustrations/app-demo-download-page.png"
                height="auto"
                alt="app do celular"
            />
        </div>
    );

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
                            thisBizLogo === undefined
                                ? "/img/official-logo-name.png"
                                : thisBizLogo
                        }
                        width={width} // bizLogo === "undefined" && 200
                        height={height}
                        title={`logo da ${bizName}`}
                        alt={`logo empresa ${bizName}`}
                    />
                </div>
                <div className="text-center text-hero">
                    <span
                        className="d-block text-title"
                        style={{ lineHeight: "50px" }}
                    >
                        Convite do clube de compras para{" "}
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
                {userName ? (
                    <span>
                        Oi,
                        <br /> {truncate(userName.cap(), isSmall ? 22 : 30)}
                    </span>
                ) : (
                    <span>Caro cliente,</span>
                )}
            </p>
            <div className="mx-2">
                <p>Você foi convidado(a) para baixar o app da </p>
                <p className="text-hero text-center">
                    {bizName && bizName.cap()}
                </p>
                <p>
                    para te oferecer uma{" "}
                    <strong>nova experiência em compras.</strong>
                    <br />
                    <br />A cada compra, você ganha moedas digitais chamada PTS
                    (pronúncia: pítis) e troca por benefícios ao atingir metas
                    em jogos de compra.
                </p>

                {showAppShowCase()}

                <p className="download-app--txt" style={styles.margin}>
                    Você vai acompanhar seus pontos de compra, progresso de
                    desafios, ter histórico compras automático, ter acesso
                    offline, avaliar sua experiência e mais!
                </p>
                <p className="download-app--txt" style={styles.margin}>
                    Baixe o seu app logo a baixo.
                    <br />
                    <br />É leve.
                    <br />É rápido.
                    <br />É grátis!
                </p>
                {showMainScrollArray()}
            </div>
        </section>
    );
}
