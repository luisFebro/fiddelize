import { Fragment } from "react";
import useAPIList, { readFiddelizeCosts } from "api/useAPIList";
import convertToReal from "utils/numbers/convertToReal";
import MonthlyCostsCard from "./card/MonthlyCostsCard";

export default function MonthlyCostsList({ newCardSet, allTimeCostAvgAmount }) {
    const {
        list = [],
        ShowOverMsg,
        loading,
        // isOffline,
        // error,
        // ShowLoading,
        // ShowError,
    } = useAPIList({
        url: readFiddelizeCosts(),
        params: {
            list: true,
        },
        trigger: true,
    });

    const finalList = [...newCardSet, ...list];
    const listTotal = !loading ? finalList.length : 0;
    const plural = listTotal > 1 ? "s" : "";
    const gotRegisters = Boolean(newCardSet.length || listTotal);

    return (
        <section className="mx-3">
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
            <section className="mt-3 mb-5">
                {finalList.map((cost) => (
                    <MonthlyCostsCard key={cost._id} data={cost} />
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
