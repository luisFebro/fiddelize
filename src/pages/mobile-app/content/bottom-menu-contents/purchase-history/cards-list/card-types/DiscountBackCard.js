import { Fragment } from "react";
import "../_PrizeCard.scss";
import convertToReal from "utils/numbers/convertToReal";
import LoyaltyIcon from "@material-ui/icons/Loyalty";
import Card from "@material-ui/core/Card";
import getColor from "styles/txt";
import InstructionBtn from "components/buttons/InstructionBtn";
import useData from "init";

export default function DiscountBackCard({ historyData, colorP }) {
    // discountPoints: this value can be used to tell how much discount was taken in discountback
    const {
        value,
        discountPoints = 200,
        discountPerc = 10,
        challengeN,
    } = historyData;
    const { firstName } = useData();

    const showDiscountedPoints = () => (
        <Fragment>
            <div className="discounted-points--root">
                <InstructionBtn
                    mode="tooltip"
                    text={`Você atingiu a meta de ${discountPoints} pts e recebeu R$ 20 (${discountPerc}% de desconto) acumulado das suas compras. Parabéns, ${firstName}!`}
                />
                <p className="mb-1 ml-3 discounted-points text-subtitle font-weight-bold">
                    -{convertToReal(discountPoints)}
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

    const displayMainContent = () => (
        <section
            className={`${
                getColor(colorP).txtColor
            } purchase-history-prize-card--root text-center`}
        >
            <main className="gift-main-title container-center">
                <div>
                    <LoyaltyIcon />
                </div>
                <span className="benefit-title d-inline-block ml-3 text-normal font-weight-bold">
                    Desconto Retornado
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
                Você recebeu:{" "}
                <span className="d-inline-block text-normal font-weight-bold">
                    {`${convertToReal(value, { moneySign: true })}`}
                    <span style={{ fontWeight: "normal" }}>
                        {" "}
                        de desconto em compras.
                    </span>
                </span>
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
        </section>
    );
}
