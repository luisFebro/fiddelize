import { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Card from "@material-ui/core/Card";
import selectTxtStyle from "utils/biz/selectTxtStyle";
import "../_PrizeCard.scss";
import convertToReal from "utils/numbers/convertToReal";

export default function TargetPrizeCard({ historyData, colorP }) {
    const {
        value,
        desc,
        challengeN,
        isPrizeConfirmed,
        isPrizeExpired,
        isPrizeReceived,
    } = historyData;

    const showDiscountedPoints = () => (
        <Fragment>
            <div className="discounted-points--root">
                <p className="discounted-points text-subtitle font-weight-bold">
                    -{convertToReal(value)}
                    <span className="d-inline-block text-small font-weight-bold ml-1">
                        pts
                    </span>
                </p>
            </div>
            <style jsx>
                {`
                    .discounted-points--root {
                        display: flex;
                        justify-content: flex-end;
                    }
                    .discounted-points {
                        padding: 0px 8px;
                        background: var(--mainWhite);
                        color: var(--expenseRed);
                        border-radius: 25px;
                        text-shadow: none;
                    }
                `}
            </style>
        </Fragment>
    );

    const showStatusPanel = () => (
        <section className="card-elevation text-purple position-relative purchase-history-status-panel--root">
            <div className="board">
                <p
                    className="text-center text-small font-weight-bold text-white"
                    style={{
                        margin: "10px 0 10px 10px",
                        backgroundColor: "var(--mainDark)",
                        borderRadius: "30% 30%",
                        padding: "5px 8px",
                    }}
                >
                    STATUS
                </p>
                <div className="confirmed-status text-small">
                    <p className="font-weight-bold">Confirmado:</p>
                    {isPrizeConfirmed ? (
                        <div className="icon animated rubberBand delay-2s repeat-2">
                            <FontAwesomeIcon
                                icon="check-circle"
                                style={{ color: "green", fontSize: "20px" }}
                            />
                        </div>
                    ) : (
                        <div className="icon">
                            <FontAwesomeIcon
                                icon="times-circle"
                                style={{ color: "grey", fontSize: "20px" }}
                            />
                        </div>
                    )}
                </div>
                <div className="received-status text-small">
                    <p className="font-weight-bold">
                        {isPrizeExpired ? "Expirado" : "Recebido:"}
                    </p>
                    {isPrizeReceived && !isPrizeExpired && (
                        <div className="icon animated rubberBand delay-2s repeat-2">
                            <FontAwesomeIcon
                                icon="check-circle"
                                style={{ color: "green", fontSize: "20px" }}
                            />
                        </div>
                    )}

                    {!isPrizeReceived && !isPrizeExpired && (
                        <div className="icon">
                            <FontAwesomeIcon
                                icon="times-circle"
                                style={{ color: "grey", fontSize: "20px" }}
                            />
                        </div>
                    )}

                    {isPrizeExpired && (
                        <div className="icon">
                            <FontAwesomeIcon
                                icon="times-circle"
                                style={{
                                    color: "var(--expenseRed)",
                                    fontSize: "20px",
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );

    const displayMainContent = () => (
        <section
            className={`${selectTxtStyle(
                colorP
            )} m-0 purchase-history-prize-card--root text-center`}
        >
            <main className="gift-main-title container-center">
                <div>
                    <FontAwesomeIcon icon="gift" />
                </div>
                <span className="benefit-title d-inline-block ml-3 text-normal font-weight-bold">
                    Prêmio Alvo
                    <br />
                    <span className="text-subtitle font-weight-bold">
                        N.º {challengeN}
                    </span>
                </span>
                <style jsx>
                    {`
                        .gift-main-title {
                            padding-top: 10px;
                        }

                        .gift-main-title div svg {
                            font-size: 50px;
                            filter: drop-shadow(0 0 25px grey);
                            color: #ff0;
                        }
                        .benefit-title {
                            line-height: 17px;
                        }
                    `}
                </style>
            </main>
            <p className="m-0 my-2 text-left font-site text-em-1-1">
                Você ganhou:{" "}
                <span className="d-inline-block text-normal">{desc}</span>
            </p>
            {isPrizeConfirmed && showDiscountedPoints()}
        </section>
    );

    return (
        <section className="my-5 position-relative">
            <Card
                key={historyData.desc}
                style={{ backgroundColor: `var(--themePLight--${colorP})` }}
            >
                {displayMainContent()}
            </Card>
            {showStatusPanel()}
        </section>
    );
}
