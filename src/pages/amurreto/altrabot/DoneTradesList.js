import { useState } from "react";
import useAPIList, { readTradesHistory } from "api/useAPIList";
import useElemDetection, { checkDetectedElem } from "api/useElemDetection";
import Cards from "./card/Cards";

export default function DoneTradeList() {
    const [skip, setSkip] = useState(0);

    const params = {
        status: "done",
    };

    const {
        list = [],
        // listTotal,
        loading,
        ShowLoadingSkeleton,
        error,
        ShowError,
        ShowOverMsg,
        // isPlural,
        hasMore,
        isOffline,
    } = useAPIList({
        url: readTradesHistory(),
        skip,
        params,
        listName: "AmurretoDoneList",
        disableDupFilter: true,
    });

    // INFINITY LOADING LIST
    const detectedCard = useElemDetection({
        loading,
        hasMore,
        setSkip,
        isOffline,
    });
    // END INFINITY LOADING LIST

    // DISPLAY
    const showTitle = () => (
        <div className="my-4 container-center">
            <h1 className="text-pill text-subtitle text-purple text-center font-weight-bold">
                Trades Concluídos
            </h1>
        </div>
    );

    const showCards = () => (
        <Cards
            list={list}
            detectedCard={detectedCard}
            checkDetectedElem={checkDetectedElem}
        />
    );
    // END DISPLAY

    return (
        <section className="mx-3">
            {showTitle()}
            {showCards()}
            {loading && <ShowLoadingSkeleton />}
            {error && <ShowError />}
            <ShowOverMsg />
        </section>
    );
}
