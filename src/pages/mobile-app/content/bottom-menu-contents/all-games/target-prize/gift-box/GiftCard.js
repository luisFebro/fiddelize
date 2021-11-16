import Card from "@material-ui/core/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const truncate = (name, leng) => window.Helper.truncate(name, leng);

export default function GiftCard({
    prizeImg,
    prizeDesc,
    targetPoints,
    didBeatGame,
    colorS,
    isCliApp = false,
}) {
    prizeDesc = truncate(prizeDesc, 21);
    const lightColor = `var(--themeSLight--${colorS})`;
    const darkColor = `var(--themeSDark--${colorS})`;

    if (prizeImg) {
        const pickMsg = () => {
            if (didBeatGame) {
                return (
                    <p className="position-relative line-height-25 text-left font-weight-bold text-normal text-purple">
                        Você ganhou:
                    </p>
                );
            }

            return (
                <p className="m-0 position-relative line-height-25 text-left font-weight-bold text-small text-purple">
                    Alcance{" "}
                    <span className="font-site text-em-1-5">
                        {targetPoints}
                    </span>{" "}
                    PTS,
                    <br />
                    <span className="font-site text-em-1-3">ganhe:</span>
                </p>
            );
        };

        const handleTransform = () => {
            if (didBeatGame) return "translateY(-290px)";
            return isCliApp ? "translateY(-320px)" : "translateY(-210px)";
        };

        return (
            <section className="container-center gift-card-img--root">
                <Card
                    raised
                    style={{
                        zIndex: 1000,
                    }}
                    className="gift-card-img text-center font-site text-em-1-1 font-weight-bold"
                >
                    {pickMsg()}
                    <div className="ribbon">
                        <span
                            style={{
                                background: `linear-gradient(${lightColor} 0%, ${darkColor} 100%)`,
                            }}
                        >
                            PRÊMIO
                        </span>
                    </div>
                    <img
                        className="img-center shadow-babadoo"
                        src={prizeImg || "/img/error.png"}
                        alt="envio foto prêmio"
                        height="100%"
                        width="100%"
                    />
                    {!didBeatGame && (
                        <p className="my-2 position-relative line-height-25 text-center font-weight-bold font-site text-em-1-2 text-purple">
                            {prizeDesc}
                        </p>
                    )}
                    <style jsx>
                        {`
                            .gift-card-img {
                                position: relative;
                                overflow: visible !important;
                                background: var(--mainWhite);
                                height: auto;
                                min-width: 220px;
                                padding: 15px;
                                z-index: 2000;
                            }
                        `}
                    </style>
                </Card>
                <style jsx>
                    {`
                        .gift-card-img--root {
                            opacity: 0;
                            transition: all 1s;
                            transition-delay: 0.5s;
                            margin: 0 auto;
                            position: relative;
                            display: block;
                            z-index: -1000;
                        }
                        .gift-box--root:hover .gift-card-img--root {
                            opacity: 1;
                            position: relative;
                            z-index: 100;
                            transform: ${handleTransform()};
                        }
                    `}
                </style>
            </section>
        );
    }

    return (
        <section className="gift-card">
            <Card
                raised
                className="gift-card--root text-center font-site text-em-1-1 font-weight-bold"
            >
                <div className="ribbon">
                    <span
                        style={{
                            background: `linear-gradient(${lightColor} 0%, ${darkColor} 100%)`,
                        }}
                    >
                        PRÊMIO
                    </span>
                </div>
                <div className="desc">
                    <span className="text-small mb-1 d-block">
                        Você
                        <br />
                        ganhou:
                    </span>
                    <div className="container-center">
                        <FontAwesomeIcon
                            icon="trophy"
                            style={{ fontSize: 18 }}
                        />
                    </div>
                    <p>{prizeDesc}</p>
                </div>
            </Card>
        </section>
    );
}
