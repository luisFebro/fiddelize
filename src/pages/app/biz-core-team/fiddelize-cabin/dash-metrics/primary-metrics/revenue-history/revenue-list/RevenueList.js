import { Fragment, useState, useEffect } from "react";
import RevenueCard from "./card/RevenueCard";
import useAPIList, {
    getFiddelizeRevenueHistory,
} from "../../../../../../../../hooks/api/useAPIList";

export default function RevenueList({ handleRevenueChart }) {
    const [skip, setSkip] = useState(0);

    const {
        list = [],
        ShowOverMsg,
        loading,
        // isOffline,
        // error,
        // ShowLoading,
        // ShowError,
    } = useAPIList({
        url: getFiddelizeRevenueHistory(),
        skip,
        listName: "FiddelizeRevenueList",
        limit: 12,
    });

    useEffect(() => {
        if (list.length) {
            // only the last 6 monthes
            handleRevenueChart(list.slice(0, 6));
        }
    }, [list]);

    const listTotal = !loading ? list.length : 0;
    const plural = listTotal > 1 ? "s" : "";
    const gotRegisters = Boolean(listTotal);

    const listMap = list.map((revenue) => (
        <RevenueCard key={revenue._id} data={revenue} />
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
                    Sem receita registrada.
                </h2>
            )}
            <ShowOverMsg />
        </section>
    );
}
