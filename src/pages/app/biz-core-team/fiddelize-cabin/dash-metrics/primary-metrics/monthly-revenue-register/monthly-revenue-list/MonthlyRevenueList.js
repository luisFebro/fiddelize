import useAPIList, { readFiddelizeRevenue } from "api/useAPIList";
import MonthlyRevenueCard from "./card/MonthlyRevenueCard";
// import convertToReal from "utils/numbers/convertToReal";
// import { Fragment } from "react";

export default function MonthlyRevenueList({ newCardSet }) {
    const {
        list = [],
        ShowOverMsg,
        loading,
        // isOffline,
        // error,
        // ShowLoading,
        // ShowError,
    } = useAPIList({
        url: readFiddelizeRevenue(),
        params: {
            list: true,
        },
        trigger: true,
    });

    const finalList = [...newCardSet, ...list];
    const listTotal = !loading ? finalList.length : 0;
    const gotRegisters = Boolean(newCardSet.length || listTotal);
    // const plural = listTotal > 1 ? "s" : "";

    return (
        <section className="mx-3">
            <section className="mt-3 mb-5">
                {finalList.map((revenue) => (
                    <MonthlyRevenueCard key={revenue._id} data={revenue} />
                ))}
            </section>
            {!gotRegisters && (
                <h2
                    className="text-center text-grey text-normal font-weight-bold"
                    style={{
                        marginTop: 150,
                    }}
                >
                    Sem registro.
                </h2>
            )}
            <ShowOverMsg />
        </section>
    );
}

/* ARCHIVES

<h2 className="my-3 text-subtitle text-purple">
    {gotRegisters && (
        <Fragment>
            <strong>
                Média Mensal
                <br />
                Custo Geral:
            </strong>
            <br />
            R$ {convertToReal(allTimeCostAvgAmount)}
            <br />
            <br />
            <strong>Total:</strong> {listTotal} registro{plural}
        </Fragment>
    )}
</h2>

 */
