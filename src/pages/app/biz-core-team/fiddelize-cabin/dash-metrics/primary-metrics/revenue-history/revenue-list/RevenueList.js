import { Fragment, useState, useEffect } from "react";
import useAPIList, { getFiddelizeRevenueHistory } from "api/useAPIList";
import useElemDetection, { checkDetectedElem } from "api/useElemDetection";
import RevenueCard from "./card/RevenueCard";

export default function RevenueList({ handleRevenueChart }) {
    const [skip, setSkip] = useState(0);

    const {
        list = [],
        listTotal,
        isPlural,
        hasMore,
        loading,
        ShowLoadingSkeleton,
        error,
        ShowError,
        ShowOverMsg,
    } = useAPIList({
        url: getFiddelizeRevenueHistory(),
        skip,
        limit: 12,
        filterId: "id",
        listName: "FiddelizeRevenueList",
    });

    useEffect(() => {
        if (list.length) {
            // only the last 6 monthes
            handleRevenueChart(list.slice(0, 6));
        }
    }, [list]);

    const gotRegisters = Boolean(listTotal);

    // INFINITY LOADING LIST
    const detectedCard = useElemDetection({ loading, hasMore, setSkip });
    const showCard = (revenue) => <RevenueCard data={revenue} />;
    const listMap = list.map((revenue, ind) =>
        checkDetectedElem({ list, ind, indFromLast: 3 }) ? (
            <section key={revenue._id} ref={detectedCard}>
                {showCard(revenue)}
            </section>
        ) : (
            <section key={revenue._id}>{showCard(revenue)}</section>
        )
    );
    // END INFINITY LOADING LIST

    const showTotal = () => (
        <h2 className="my-3 text-subtitle text-purple">
            {gotRegisters && (
                <Fragment>
                    <strong>Total:</strong> {listTotal} registro{isPlural}
                </Fragment>
            )}
        </h2>
    );

    return (
        <section className="mx-3">
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
                    Sem receita registrada.
                </h2>
            )}
            {error && <ShowError />}
            <ShowOverMsg />
            <div className="mx-3 my-5 font-site text-em-1-1 text-grey">
                <p className="text-purple text-subtitle">Notas:</p>- Dados de
                todos os tempos tanto do custo e lucro de cada mês é carregado,
                apesar do gráfico filtrar apenas os 6 últimos meses.
            </div>
        </section>
    );
}
