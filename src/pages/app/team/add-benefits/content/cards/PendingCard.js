import { Fragment } from "react";
import { useBizData } from "init";
import { selectBrBenefitType, gameIconsStore } from "components/biz/GamesBadge";
import getFirstName from "utils/string/getFirstName";
import NewCardPill, { checkCardNew } from "components/pills/NewCardPill";
import getItems from "init/lStorage";
import SelectedCTA from "./cta/SelectedCTA";

const [lastDate] = getItems("global", ["lastDatePendingBenefitCard"]);

export default function PendingCard({ data }) {
    const {
        allAvailableBenefits,
        benefitUpdatedAt,
        recordId,
        beatGameList,
        currPoints,
        customerId,
        gender,
    } = data;
    let { customerName } = data;
    customerName = getFirstName(customerName && customerName.cap(), {
        addSurname: true,
    });

    const { themePColor } = useBizData();
    const availableBenefitsCount = beatGameList.length;
    const pluralBenefits = availableBenefitsCount > 1 ? "s" : "";

    const gameItemProps = {
        allAvailableBenefits,
        availableBenefitsCount,
        customerId,
        recordId,
        themePColor,
        customerName,
        currPoints,
        gender,
        gameName: beatGameList.length === 1 && beatGameList[0].game,
    };

    const showBenefitsArea = () => (
        <section className="d-flex my-3 benefits-area">
            {beatGameList
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

    const showNewCardBadge = () => {
        const isCardNew = checkCardNew({
            targetDate: benefitUpdatedAt,
            lastDate,
        });

        return (
            <div
                className="position-absolute"
                style={{
                    top: -15,
                    right: 0,
                }}
            >
                {isCardNew && <NewCardPill />}
            </div>
        );
    };

    return (
        <section className="benefit-card--root mb-4 position-relative text-normal text-white text-shadow">
            {showNewCardBadge()}
            <h2 className="text-subtitle font-weight-bold">{customerName}</h2>
            <p className="m-0 text-normal">
                <span className="highlight-benefits text-pill">
                    {availableBenefitsCount} Benefício{pluralBenefits}
                </span>{" "}
                disponí{pluralBenefits === "s" ? "veis:" : "vel:"}
            </p>
            {showBenefitsArea()}
            <SelectedCTA allBenefitGames={beatGameList} {...gameItemProps} />
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
    return (
        <div className="position-relative mr-3 container-center-col">
            {gameIconsStore[d.game]}
            <span className="text-small font-weight-bold">
                {selectBrBenefitType(d.game)}
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
            {truncate(d.benefitDesc, 20)}
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
