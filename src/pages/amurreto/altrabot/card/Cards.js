import { fromNow } from "utils/dates/dateFns";
import convertToReal from "utils/numbers/convertToReal";
import getPercentage from "utils/numbers/getPercentage";
import TradeCard from "./accordion/TradeCard";
import PanelHiddenContent from "./card-hidden-content/PanelHiddenContent";

export default function Cards({
    list,
    isLiveTrade,
    detectedCard,
    checkDetectedElem,
}) {
    const actions = list.map((data) => {
        const MainHeading = <MainH data={data} isLiveTrade={isLiveTrade} />;
        const SecondaryHeading = <SecHeading data={data} />;
        const HiddenPanel = (
            <PanelHiddenContent data={data} isLiveTrade={isLiveTrade} />
        );

        return {
            _id: data.createdAt,
            mainHeading: MainHeading,
            secondaryHeading: SecondaryHeading,
            hiddenContent: HiddenPanel,
            // data here is immutable only. If you need handle a mutable data, set it to teh card's actions iteration.
            data,
        };
    });

    return (
        <section id="showNewCTA">
            <TradeCard
                detectedCard={detectedCard}
                checkDetectedElem={checkDetectedElem}
                actions={actions}
                backgroundColor="var(--themePLight)"
                color="white"
                needToggleButton
            />
        </section>
    );
}

// COMPS
function MainH({ data, isLiveTrade }) {
    function DisplayAsset({ symbol }) {
        return (
            <section className="d-flex">
                <span
                    className="position-relative  d-inline-block text-subtitle font-weight-bold text-shadow"
                    style={{ lineHeight: "25px", top: 5 }}
                >
                    {symbol}
                </span>
            </section>
        );
    }

    function ShowPrices({ buyPrice, sellPrice }) {
        return (
            <section className="text-small position-absolute card-show-prices">
                <p className="m-0 text-shadow">
                    (V){" "}
                    {convertToReal(sellPrice, {
                        moneySign: true,
                        needFraction: true,
                    })}{" "}
                </p>
                <p className="text-shadow">
                    (C){" "}
                    {convertToReal(buyPrice, {
                        moneySign: true,
                        needFraction: true,
                    })}{" "}
                </p>
                <style jsx>
                    {`
                        .card-show-prices {
                            top: -5px;
                            right: -55px;
                        }
                    `}
                </style>
            </section>
        );
    }

    const { finalBalanceAmount, netProfitAmount } = data.results;
    const netProfitPerc = getPercentage(finalBalanceAmount, netProfitAmount, {
        toFixed: 2,
    });
    const isPlusProfit = netProfitPerc >= 0;

    return (
        <section className="d-flex flex-column align-self-start">
            <DisplayAsset symbol={data.symbol} />
            <ShowPrices
                buyPrice={data.buyMarketPrice}
                sellPrice={data.sellMarketPrice}
            />
            <p
                className="m-0 mt-4 text-normal text-shadow font-weight-bold"
                style={{ lineHeight: "25px" }}
            >
                <span className="d-block main-font text-em-0-9 font-weight-bold">
                    saldo {isLiveTrade ? "líquido" : ""}:
                    <br />
                    <span className="text-pill d-inline-block mt-1 font-weight-bold main-font text-em-1-2">
                        {convertToReal(finalBalanceAmount, {
                            moneySign: true,
                            needFraction: true,
                        })}
                    </span>
                </span>
                <span className="mt-3 d-block main-font text-em-0-8 font-weight-bold">
                    {isPlusProfit ? "lucro: " : "perca: "}
                    <span
                        className={`text-pill ${
                            isPlusProfit ? "text-sys-green" : "text-red"
                        } card-profit d-inline-block mt-1 font-weight-bold`}
                    >
                        {convertToReal(netProfitAmount, {
                            moneySign: true,
                            needFraction: true,
                        })}{" "}
                        <span>
                            ({isPlusProfit ? "+" : ""}
                            {netProfitPerc}%)
                        </span>
                        <style jsx>
                            {`
                                .card-profit {
                                    color: var(--mainPurple);
                                    background-color: #fff;
                                    text-shadow: none;
                                }
                            `}
                        </style>
                    </span>
                </span>
            </p>
        </section>
    );
}

function SecHeading({ data }) {
    return (
        <section className="position-relative">
            <p className="team-tasks date-badge text-nowrap position-relative d-block m-0 mt-2">
                <span className="text-small text-shadow font-weight-bold">
                    Iniciado {fromNow(data.createdAt)}.
                </span>
                <style jsx>
                    {`
                        .team-tasks.date-badge {
                            backgroundcolor: var(--themeP);
                            borderradius: 20%;
                        }
                    `}
                </style>
            </p>
        </section>
    );
}
// END COMPS
