import MuSelectTable from "components/tables/MuSelectTable";
import convertToReal from "utils/numbers/convertToReal";
import getPercentage from "utils/numbers/getPercentage";
// import getAPI, { decode } from "api";
// import useData from "init";

/* datahead
data = 25/07/21 às 15:30
qtde cota = R$ 83.34 (100%)
qtde base = 0.004563
mercado =177.841
estratégia = emaBull9OVer20
taxa =R$ 0.25 (0.3%)

 */
const headCells = [
    { id: "date", numeric: false, disablePadding: false, label: "Data" },
    {
        id: "capital",
        numeric: true,
        disablePadding: false,
        label: "Qtde. Cota",
    },
    {
        id: "base",
        numeric: true,
        disablePadding: false,
        label: "Qtde. Base",
    },
    { id: "market", numeric: true, disablePadding: false, label: "P. mercado" },
    {
        id: "strategy",
        numeric: false,
        disablePadding: false,
        label: "Estratégia",
    },
    { id: "fee", numeric: false, disablePadding: false, label: "Taxa" },
];

const tableListTest = [
    {
        date: "23/07/21",
        capital: "R$ 83.34 (100%)",
        base: 0.004563,
        market: 177.841,
        strategy: "emaBull9OVer20",
        fee: "R$ 0.25 (0.3%)",
    },
    {
        date: "28/07/21",
        capital: "R$ 150.34 (100%)",
        base: 0.008563,
        market: 179.841,
        strategy: "emaBull70Ver20",
        fee: "R$ 0.50 (0.6%)",
    },
];

function PanelHiddenContent({ tableList = tableListTest, data = {} }) {
    const {
        capitalPosition,
        results,
        status,
        statusExchange,
        totalFeeAmount,
    } = data;
    // const { } = data.fee;

    const {
        finalBalanceAmount,
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
                            convertToReal(capitalPosition.amount, {
                                moneySign: true,
                                needFraction: true,
                            })}
                    </span>
                </p>
                <p className="mb-4 font-weight-bold text-shadow">
                    • Final:
                    <span className="text-pill d-block font-weight-bold">
                        {results &&
                            convertToReal(results.finalBalanceAmount, {
                                moneySign: true,
                                needFraction: true,
                            })}
                    </span>
                </p>
            </div>
            <hr className="lazer white" />
            <p className="text-center mb-4 text-normal font-weight-bold text-shadow">
                LUCRO E TAXA
            </p>
            <section className="containerProfit">
                <p className="mb-4 font-weight-bold text-shadow">
                    • Bruto:
                    <span className="d-block">
                        {convertToReal(grossProfitAmount, {
                            moneySign: true,
                            needFraction: true,
                        })}
                    </span>
                </p>
                <p className="mb-4 font-weight-bold text-shadow">
                    • Taxas Totais:
                    <span className="d-block d-table text-pill part-fee">
                        {convertToReal(totalFeeAmount, {
                            moneySign: true,
                            needFraction: true,
                        })}
                        <span className="text-red"> ({totalFeePerc}%)</span>
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
                    <span className="d-table card-profit text-pill d-block mt-1 font-weight-bold">
                        {convertToReal(netProfitAmount, { moneySign: true })}{" "}
                        <span className="profit-color">
                            ({isPlusProfit ? "+" : ""}
                            {netProfitPerc}%)
                        </span>
                        <style jsx>
                            {`
                                .profit-color {
                                    color: ${isPlusProfit
                                        ? "green"
                                        : "var(--expenseRed)"};
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
            <hr className="lazer white" />
            <p className="text-center mb-4 text-normal font-weight-bold text-shadow">
                TRANSAÇÕES
            </p>
            <p className="mb-4 font-weight-bold text-shadow">• Compras:</p>
            <MuSelectTable
                headCells={headCells}
                rowsData={tableList}
                enumeration="number"
                loading={false}
                needMainTitle={false}
                needHighlightColor={false}
            />
            <p className="mb-4 font-weight-bold text-shadow">• Vendas:</p>
            <MuSelectTable
                headCells={headCells}
                rowsData={tableList}
                enumeration="number"
                loading={false}
                needMainTitle={false}
                needHighlightColor={false}
            />
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
