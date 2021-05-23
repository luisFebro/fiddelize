import { Fragment } from "react";
import { useBizData } from "init";
import { gameIconsStore } from "components/biz/GamesBadge";
import SelectedCTA from "./cta/SelectedCTA";

const benefitsListTest = [
    {
        game: "targetPrize",
        desc: "Ticket de Ingresso muito top meu deus",
    },
    {
        game: "discountBack",
        desc: "R$ 50 de desconto",
    },
];

const allBenefitGames = benefitsListTest.map((d) => d.game);

export default function PendingCard({ data }) {
    const { name, benefitsList = benefitsListTest } = data;

    const { themePColor, themeSColor } = useBizData();
    const availableBenefitsCount = benefitsList.length;
    const pluralBenefits = availableBenefitsCount > 1 ? "s" : "";

    const gameItemProps = {
        availableBenefitsCount,
        themePColor,
    };

    const showBenefitsArea = () => (
        <section className="d-flex my-3 benefits-area">
            {benefitsList
                .map((d, ind) => (
                    <Fragment key={d.game}>
                        <GameItem d={d} ind={ind} {...gameItemProps} />
                        {availableBenefitsCount === 1 && (
                            <BenefitInfo d={d} themePColor={themePColor} />
                        )}
                    </Fragment>
                ))
                .slice(0, 2)}
        </section>
    );

    return (
        <section className="benefit-card--root mb-3 position-relative text-normal text-white text-shadow">
            <h2 className="text-subtitle font-weight-bold">{name}</h2>
            <p className="m-0 text-normal">
                <span className="highlight-benefits text-pill">
                    {availableBenefitsCount} Benefício{pluralBenefits}
                </span>{" "}
                disponí{pluralBenefits === "s" ? "veis:" : "vel:"}
            </p>
            {showBenefitsArea()}
            <SelectedCTA
                benefitsList={benefitsList}
                allBenefitGames={allBenefitGames}
                themeSColor={themeSColor}
            />
            <style jsx>
                {`
                    .benefit-card--root {
                        padding: 8px 12px;
                        background: var(--themePDark--${themePColor});
                        border-radius: 15px;
                    }

                    .benefit-card--root .highlight-benefits {
                        background: var(--mainWhite);
                        text-shadow: none;
                        color: var(--themePDark--${themePColor});
                    }

                    .benefit-card--root .benefits-area svg {
                        font-size: 35px;
                    }
                `}
            </style>
        </section>
    );
}

function GameItem({ d, ind, availableBenefitsCount, themePColor }) {
    const selectBenefitType = (game) => {
        if (game === "discountBack") return "vale";
        return "prêmio";
    };

    return (
        <div className="position-relative mr-3 container-center-col">
            {gameIconsStore[d.game]}
            <span className="text-small font-weight-bold">
                {selectBenefitType(d.game)}
            </span>
            {ind === 1 && availableBenefitsCount > 2 && (
                <div className="more-than-three position-absolute font-weight-bold">
                    <span>+</span>
                    <style jsx>
                        {`
                            .more-than-three {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                top: 10px;
                                right: -35px;
                                width: 25px;
                                height: 25px;
                                background: var(--mainWhite);
                                color: var(--themePDark--${themePColor});
                                border-radius: 50%;
                                text-shadow: none;
                                font-size: 25px;
                            }
                        `}
                    </style>
                </div>
            )}
        </div>
    );
}

function BenefitInfo({ d, themePColor }) {
    const truncate = (name, leng) => window.Helper.truncate(name, leng);

    return (
        <section className="benefit-info text-small text-break font-weight-bold text-left">
            <strong className="d-block text-center">GANHO:</strong>
            {truncate(d.desc, 20)}
            <style jsx>
                {`
                    .benefit-info {
                        background: var(--mainWhite);
                        color: var(--themePDark--${themePColor});
                        width: 110px;
                        border-radius: 5px;
                        text-shadow: none;
                        padding: 5px;
                        box-shadow: inset 0 0 0.4em #000;
                    }
                `}
            </style>
        </section>
    );
}
