import getMonthNowBr from "utils/dates/getMonthNowBr";
import convertToReal from "utils/numbers/convertToReal";

export default function AvgTicket({ mainData }) {
    const currMonth = getMonthNowBr();

    const currAvgTicket = mainData && mainData.currAvgTicket;
    const lastAvgTicket = mainData && mainData.lastAvgTicket;
    const diffAvgTicket = currAvgTicket - lastAvgTicket;
    const isGreatStatus = diffAvgTicket > 0;

    const currMonthSalesCount = mainData && mainData.currMonthSalesCount;
    const lastMonthSalesCount = mainData && mainData.lastMonthSalesCount;

    const pluralCurrSales = currMonthSalesCount > 1 ? "s" : "";
    const pluralLastSales = lastMonthSalesCount > 1 ? "s" : "";

    return (
        <section>
            <p className="mt-5 text-purple text-subtitle font-weight-bold text-center">
                Ticket Médio
                <br />
                <span
                    className="d-block text-normal text-purple"
                    style={{
                        lineHeight: "25px",
                    }}
                >
                    Quanto cada cliente está investindo em {currMonth}?
                    <br />
                    <span className="text-normal text-grey">
                        (total vendas R$ / qtde. vendas)
                    </span>
                </span>
            </p>
            <section className="d-flex justify-content-around">
                <div
                    className="my-3 text-center text-normal font-weight-bold text-purple"
                    style={{
                        lineHeight: "20px",
                    }}
                >
                    R$ {convertToReal(lastAvgTicket)}
                    <br />
                    <span className="text-small font-weight-bold">
                        mês anterior
                    </span>
                    <br />
                    <span className="text-small font-weight-bold">
                        ({lastMonthSalesCount} venda{pluralLastSales})
                    </span>
                </div>
                <div
                    className="my-3 text-center text-subtitle font-weight-bold text-purple"
                    style={{
                        lineHeight: "20px",
                    }}
                >
                    R$ {convertToReal(currAvgTicket)}
                    <br />
                    <span className="text-normal">mês atual</span>
                    <br />
                    <span className="text-small font-weight-bold">
                        ({currMonthSalesCount} venda{pluralCurrSales})
                    </span>
                </div>
            </section>
            {isGreatStatus ? (
                <p className="text-sys-green text-center text-small font-weight-bold">
                    Ótimo! Cada cliente está investindo
                    <br />
                    <span className="text-em-1-4">
                        R$ {convertToReal(diffAvgTicket)} a mais
                    </span>{" "}
                    neste mês.
                </p>
            ) : (
                <p className="text-red text-small font-weight-bold text-center">
                    Atenção! Cada cliente está investindo
                    <br />
                    <span className="text-em-1-4">
                        R$ {convertToReal(diffAvgTicket)} a menos
                    </span>{" "}
                    neste mês.
                </p>
            )}
        </section>
    );
}
