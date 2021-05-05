import { Fragment } from "react";
import useAPIList, { readFiddelizeCosts } from "api/useAPIList";
import MonthlyCostsCard from "./card/MonthlyCostsCard";

export default function MonthlyCostsList({ newCardSet }) {
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
    });

    const finalList = [...newCardSet, ...list];
    const listTotal = !loading ? finalList.length : 0;
    const plural = listTotal > 1 ? "s" : "";
    const gotRegisters = Boolean(newCardSet.length || listTotal);

    const listMap = finalList.map((cost) => (
        <MonthlyCostsCard key={cost._id} data={cost} />
    ));

    return (
        <section className="mx-3">
            <h2 className="my-3 text-subtitle text-purple">
                {gotRegisters && (
                    <Fragment>
                        <strong>Total:</strong> {listTotal} registro{plural}
                    </Fragment>
                )}
            </h2>
            <section className="mt-3 mb-5">{listMap}</section>
            {!gotRegisters && (
                <h2
                    className="text-center text-grey text-normal font-weight-bold"
                    style={{
                        marginTop: 150,
                    }}
                >
                    Sem custos registrados
                </h2>
            )}
            <ShowOverMsg />
        </section>
    );
}
