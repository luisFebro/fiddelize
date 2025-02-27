import { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Card from "@material-ui/core/Card";
import getColor from "styles/txt";
import "../_PrizeCard.scss";
import convertToReal from "utils/numbers/convertToReal";

export default function TargetPrizeCard({ historyData, colorP }) {
    const { value, desc, challN } = historyData;
    // from version 4.50 and onwards, expired cards are no longer recorded in the buy register since it doesn't affect coins. But it will be sent a card notification instead when expired

    const showDiscountedPoints = () => (
        <Fragment>
            <div className="discounted-points--root">
                <p className="discounted-points text-subtitle font-weight-bold">
                    -{convertToReal(value)}
                    <span className="d-inline-block text-small font-weight-bold ml-1">
                        PTS
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
                <div className="received-status text-small">
                    <p className="font-weight-bold">Recebido:</p>
                    <div className="icon animated rubberBand delay-2s repeat-2">
                        <FontAwesomeIcon
                            icon="check-circle"
                            style={{ color: "green", fontSize: "20px" }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );

    const displayMainContent = () => (
        <section
            className={`${
                getColor(colorP).txtColor
            } m-0 purchase-history-prize-card--root text-center`}
        >
            <main className="gift-main-title container-center">
                <div>
                    <FontAwesomeIcon icon="gift" />
                </div>
                <span className="benefit-title d-inline-block ml-3 text-normal font-weight-bold">
                    Prêmio Alvo
                    <br />
                    <span className="text-subtitle font-weight-bold">
                        N.º {challN}
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
            {showDiscountedPoints()}
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

/* ARCHIVES

{isBenefitEfdaxpired && (
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

*/
