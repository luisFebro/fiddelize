import MuSelectTable from "components/tables/MuSelectTable";
import convertToReal from "utils/numbers/convertToReal";
import getPercentage from "utils/numbers/getPercentage";
import repeat from "utils/arrays/repeat";
import { calendar } from "utils/dates/dateFns";
// import getAPI, { decode } from "api";
// import useData from "init";

const headCells = [
    { id: "date", disablePadding: false, label: "Data" },
    {
        id: "quoteAndTransPerc",
        disablePadding: false,
        label: "Qtde. Cota",
    },
    {
        id: "base",
        disablePadding: false,
        label: "Qtde. Base",
    },
    { id: "market", disablePadding: false, label: "Preço mercado" },
    {
        id: "strategy",
        disablePadding: false,
        label: "Estratégia",
    },
    {
        id: "orderType",
        disablePadding: false,
        label: "Tipo Ordem",
    },
    { id: "fee", disablePadding: false, label: "Taxa" },
];

function PanelHiddenContent({ data = {}, isLiveTrade }) {
    const {
        capitalPosition,
        results,
        status,
        statusExchange,
        totalFeeAmount,
        buyTableList,
        sellTableList,
    } = data;

    const treatedBuyTableList = treatTableList(buyTableList);
    const treatedSellTableList = treatTableList(sellTableList);

    const {
        finalBalanceAmount,
        finalGrossBalanceAmount,
        netProfitAmount,
        grossProfitAmount,
    } = data.results;
    const netProfitPerc = getPercentage(finalBalanceAmount, netProfitAmount, {
        toFixed: 2,
    });
    const isPlusProfit = netProfitPerc > 0;

    const totalFeePerc = getPercentage(finalBalanceAmount, totalFeeAmount, {
        toFixed: 2,
    });

    return (
        <section className="position-relative font-site text-em-1 enabledLink panel-hidden-content--root">
            <p className="text-center mb-4 text-normal font-weight-bold text-shadow">
                SALDO
            </p>
            <p className="m-0 mb-4 font-weight-bold text-shadow">
                • Posição Capital:{" "}
                {capitalPosition && capitalPosition.totalPerc}%
            </p>
            <div className="d-flex justify-content-around">
                <p className="mb-4 font-weight-bold text-shadow">
                    • Inicial:
                    <span className="d-block font-weight-bold">
                        {capitalPosition &&
                            convertToReal(
                                treatedBuyTableList[0] &&
                                    treatedBuyTableList[0].quoteAmount,
                                {
                                    moneySign: true,
                                    needFraction: true,
                                }
                            )}
                    </span>
                </p>
                <p className="mb-4 font-weight-bold text-shadow">
                    {isLiveTrade ? "• Bruto:" : "• Final:"}
                    <span
                        className={`${
                            !isLiveTrade ? "text-pill" : ""
                        } d-block font-weight-bold`}
                    >
                        {convertToReal(
                            isLiveTrade
                                ? finalGrossBalanceAmount
                                : finalBalanceAmount,
                            {
                                moneySign: true,
                                needFraction: true,
                            }
                        )}
                    </span>
                </p>
            </div>
            {isLiveTrade && (
                <p className="container-center-col mb-4 font-weight-bold text-shadow">
                    • Final Líquido:
                    <span className="text-pill d-block font-weight-bold">
                        {convertToReal(results.finalBalanceAmount, {
                            moneySign: true,
                            needFraction: true,
                        })}
                    </span>
                </p>
            )}
            <hr className="lazer white" />
            <p className="text-center mb-4 text-normal font-weight-bold text-shadow">
                LUCRO E TAXA
            </p>
            {totalFeeAmount ? (
                <section className="containerProfit">
                    <p className="mb-4 font-weight-bold text-shadow">
                        • Bruto:
                        <span className="d-block">
                            {!isPlusProfit ? "- " : "+ "}
                            {convertToReal(grossProfitAmount, {
                                moneySign: true,
                                needFraction: true,
                            })}
                        </span>
                    </p>
                    <p className="mb-4 font-weight-bold text-shadow">
                        • Taxas Totais:
                        <span
                            className="d-block d-table text-pill part-fee"
                            style={{
                                color: "var(--expenseRed)",
                            }}
                        >
                            {convertToReal(totalFeeAmount, {
                                moneySign: true,
                                needFraction: true,
                            })}
                            <span> (-{totalFeePerc}%)</span>
                            <style jsx>
                                {`
                                    .part-fee {
                                        color: var(--mainPurple);
                                        background-color: #fff;
                                        text-shadow: none;
                                    }
                                `}
                            </style>
                        </span>
                    </p>
                    <p className="mb-4 font-weight-bold text-shadow">
                        • Líquido:
                        <span className="d-table card-profit profit-color text-pill d-block mt-1 font-weight-bold">
                            {convertToReal(netProfitAmount, {
                                moneySign: true,
                            })}{" "}
                            <span>
                                ({isPlusProfit ? "+" : ""}
                                {netProfitPerc}%)
                            </span>
                            <style jsx>
                                {`
                                    .profit-color {
                                        color: ${isPlusProfit
                                            ? "green"
                                            : "var(--expenseRed)"} !important;
                                    }
                                `}
                            </style>
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
                    </p>
                    <style jsx>
                        {`
                            .containerProfit {
                                display: block;
                            }
                            @media only screen and (min-width: 700px) {
                                .containerProfit {
                                    display: flex;
                                    justify-content: space-around;
                                }
                            }
                        `}
                    </style>
                </section>
            ) : (
                <p className="text-center mb-4 font-weight-bold text-shadow">
                    Lucros e taxas totais pendentes
                </p>
            )}
            <hr className="lazer white" />
            <p className="text-center mb-4 text-normal font-weight-bold text-shadow">
                TRANSAÇÕES
            </p>
            <p className="mb-4 font-weight-bold text-shadow">• COMPRAS:</p>
            <MuSelectTable
                headCells={headCells}
                rowsData={treatedBuyTableList}
                enumeration="number"
                loading={false}
                needMainTitle={false}
                needHighlightColor={false}
            />
            <p className="mb-4 font-weight-bold text-shadow">• VENDAS:</p>
            {treatedSellTableList.length ? (
                <MuSelectTable
                    headCells={headCells}
                    rowsData={treatedSellTableList}
                    enumeration="number"
                    loading={false}
                    needMainTitle={false}
                    needHighlightColor={false}
                />
            ) : (
                <p className="mb-4 text-center font-weight-bold text-shadow">
                    vendas pendentes
                </p>
            )}
            <br />
            <p className="mb-4 font-weight-bold text-shadow">
                • Status Final: {handleStatus(status)}
            </p>
            <p className="mb-4 font-weight-bold text-shadow">
                • Status Corretora: {statusExchange}
            </p>
        </section>
    );
}

// HELPERS
function handleStatus(name) {
    if (name === "done") return "FEITO";
    if (name === "pending") return "PENDENTE";
    return null;
}

function treatTableList(data = {}) {
    if (data && !data.date) return [];
    const elemsCount = data && data.date.length;

    return repeat(elemsCount).map((transaction, ind) => {
        const {
            date,
            base,
            quoteAndTransPerc,
            market,
            orderType,
            strategy,
            fee,
        } = data;

        const quoteAmount = quoteAndTransPerc && quoteAndTransPerc.amount[ind];
        const transPerc =
            quoteAndTransPerc && quoteAndTransPerc.transactionPositionPerc[ind];

        const feeAmount = fee && fee.amount[ind];
        const feePerc = fee && fee.perc[ind];

        return {
            date: calendar(date[ind]),
            quoteAndTransPerc: `R$${quoteAmount} (${transPerc}%)`,
            base: base[ind],
            market: convertToReal(market[ind], {
                moneySign: true,
                needFraction: true,
            }),
            orderType: orderType[ind],
            strategy: strategy[ind],
            fee: `${convertToReal(feeAmount, {
                moneySign: true,
                needFraction: true,
            })} (${feePerc}%)`,
            quoteAmount,
        };
    });
}
// END HELPERS

export default PanelHiddenContent;

/* ARCHIVES
<TextField
    multiline
    rows={8}
    id="msgArea"
    name="message"
    InputProps={{
        style: styles.fieldFormValue,
    }}
    value={data.sentMsgDesc}
    variant="outlined"
    fullWidth
/>

<p className="animated flip slow delay-2s"> first flip that I was looking for with the style of  a n entire 360 with zooming.
<CreatedAtBr createdAt={createdAt} />
*/
