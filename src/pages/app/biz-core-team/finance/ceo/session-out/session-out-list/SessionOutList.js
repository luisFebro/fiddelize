import { Fragment, useState, useEffect } from "react";
import SessionCard from "./card/SessionCard";
import useAPIList, {
    readFinanceTransactions,
} from "../../../../../../../hooks/api/useAPIList";

export default function SessionOutList({ mainData }) {
    const [skip, setSkip] = useState(0);

    const handleBalance = mainData && mainData.handleBalance;

    const params = {
        type: "out",
    };

    const {
        list = [],
        ShowOverMsg,
        loading,
        content,
        extractStrData,
    } = useAPIList({
        url: readFinanceTransactions(),
        skip,
        params,
        listName: "ExpenseFinanceSessionList",
        limit: 10,
    });

    useEffect(() => {
        if (list.length) {
            const { balance } = extractStrData(content);
            handleBalance(Number(balance));
        }
    }, [list]);

    const listTotal = !loading ? list.length : 0;
    const plural = listTotal > 1 ? "s" : "";
    const gotRegisters = Boolean(listTotal);

    const listMap = null;
    // const listMap = list.map((revenue) => (
    //     <SessionCard key={revenue._id} data={revenue} />
    // ));

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
                        margin: "150px 0",
                    }}
                >
                    Sem despesas registradas.
                </h2>
            )}
            <ShowOverMsg />
        </section>
    );
}
