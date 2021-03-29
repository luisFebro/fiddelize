import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import getPercentage from "../../../../../../../../utils/numbers/getPercentage";
import "./_SessionCard.scss";
import convertToReal from "../../../../../../../../utils/numbers/convertToReal";

export default function SessionCard({ data }) {
    const { year, month, salesAmount, salesCount, costAmount } = data;

    const monthYear = getMonthYear({ year, month });
    const profitAmount = salesAmount - costAmount;

    const revenueAmountFinal = convertToReal(salesAmount, { moneySign: true });
    const costAmountFinal = convertToReal(costAmount, { moneySign: true });
    const profitAmountFinal = convertToReal(profitAmount, { moneySign: true });

    let netProfitMargin = getPercentage(salesAmount, profitAmount); // ((profitValue / revenue) * 100).toFixed(1)
    netProfitMargin = netProfitMargin < 0 ? 0 : netProfitMargin;

    const statusColor = profitAmount > 0 ? "text-sys-green" : "text-red";

    const showProfit = () => (
        <div className="profit-area text-center position-relative">
            <h2 className={`text-normal m-0 ${statusColor}`}>
                {netProfitMargin ? "Lucro" : "Perca"}
            </h2>
            <p
                className={`m-0 font-site text-em-0-8 font-weight-bold ${statusColor}`}
            >
                {profitAmountFinal}
            </p>
            <p className={`profit-rate font-site text-em-0-9 ${statusColor}`}>
                <div className="d-flex align-items-center">
                    <span>{netProfitMargin}%</span>
                    <FontAwesomeIcon
                        icon={
                            statusColor === "text-red"
                                ? "arrow-down"
                                : "arrow-up"
                        }
                        style={{
                            fontSize: 20,
                        }}
                    />
                </div>
            </p>
        </div>
    );

    const plural = salesCount > 1 ? "s" : "";
    return (
        <section className="revenue-card--root my-5 text-normal text-white">
            <div className="d-flex justify-content-around align-items-center">
                <h2 className="text-subtitle text-white text-center">
                    {monthYear}
                </h2>
                {showProfit()}
            </div>
            <div className="mt-2 d-flex justify-content-around">
                <div className="text-center">
                    <h2 className="text-normal m-0">
                        {salesCount} Venda{plural}
                    </h2>
                    <p className="m-0 text-normal">{revenueAmountFinal}</p>
                </div>
                <div className="text-center">
                    <h2 className="text-normal m-0">Custo</h2>
                    <p className="m-0 text-normal">{costAmountFinal}</p>
                </div>
            </div>
        </section>
    );
}

// HELPERS
function getMonthYear({ month, year }) {
    const getMonth = {
        1: "Janeiro",
        2: "Fevereiro",
        3: "Março",
        4: "Abril",
        5: "Maio",
        6: "Junho",
        7: "Julho",
        8: "Agosto",
        9: "Setembro",
        10: "Outubro",
        11: "Novembro",
        12: "Dezembro",
    };

    return `${getMonth[month]}, ${year}`;
}
// END HELPERS
