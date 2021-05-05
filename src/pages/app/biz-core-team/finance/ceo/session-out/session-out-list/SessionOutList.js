import { Fragment, useState, useEffect } from "react";
import SessionCard from "./card/SessionCard";
import useAPIList, { readFinanceTransactions } from "api/useAPIList";
import useElemDetection, { checkDetectedElem } from "api/useElemDetection";

export default function SessionOutList({ mainData }) {
    const [skip, setSkip] = useState(0);

    const handleBalance = mainData && mainData.handleBalance;
    const newCardSet = mainData && mainData.newCardSet;

    const params = {
        type: "out",
    };

    const {
        list = [],
        listTotal,
        isPlural,
        ShowOverMsg,
        hasMore,
        content,
        extractStrData,
        loading,
        ShowLoadingSkeleton,
        error,
        ShowError,
    } = useAPIList({
        url: readFinanceTransactions(),
        skip,
        params,
        listName: "ExpenseFinanceSessionList",
        limit: 10,
    });

    useEffect(() => {
        if (!loading && content) {
            const { balance } = extractStrData(content);
            handleBalance(Number(balance));
        }
    }, [loading, content]);

    const finalList = [...newCardSet, ...list];
    const gotRegisters = Boolean(newCardSet.length || Boolean(listTotal));

    // INFINITY LOADING LIST
    const detectedCard = useElemDetection({ loading, hasMore, setSkip });
    const showCard = (transaction) => <SessionCard data={transaction} />;

    const listMap = finalList.map((transaction, ind) =>
        checkDetectedElem({ list: finalList, ind, indFromLast: 3 }) ? (
            <section key={transaction._id} ref={detectedCard}>
                {showCard(transaction)}
            </section>
        ) : (
            <section key={transaction._id}>{showCard(transaction)}</section>
        )
    );
    // END INFINITY LOADING LIST

    const showTotal = () => (
        <h2 className="my-3 mx-3 text-subtitle text-purple">
            {gotRegisters && (
                <Fragment>
                    <strong>Total:</strong> {listTotal + newCardSet.length}{" "}
                    registro{isPlural}
                </Fragment>
            )}
        </h2>
    );

    return (
        <section>
            {showTotal()}
            <section className="mt-3 mb-5">{listMap}</section>
            {loading && <ShowLoadingSkeleton />}
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
            {error && <ShowError />}
            <ShowOverMsg />
        </section>
    );
}
