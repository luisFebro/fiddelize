import { useState, useEffect } from "react";
import useAPIList, { readTradesHistory } from "api/useAPIList";
import useElemDetection, { checkDetectedElem } from "api/useElemDetection";
import getId from "utils/getId";
import Cards from "./card/Cards";

export default function LiveTradeList() {
    const [skip, setSkip] = useState(0);
    const [trigger, setTrigger] = useState(true);
    const [stopTimer, setStopTimer] = useState(false);

    useEffect(() => {
        // update data every focus time.
        window.addEventListener("focus", async () => {
            setTrigger(getId());
        });
    }, []);

    const params = {
        status: "pending",
    };

    const timer = useTimer({ stop: stopTimer });
    const maxTimer = timer >= 30;

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
        needEmptyIllustra,
    } = useAPIList({
        url: readTradesHistory(),
        skip,
        params,
        listName: "LiveAltrabotList",
        disableDupFilter: true,
        trigger: maxTimer ? trigger : timer,
    });

    useEffect(() => {
        if (stopTimer) return;
        if ((!loading && !list.length) || maxTimer) setStopTimer(true);
    }, [loading, list, stopTimer, maxTimer]);

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
                Negociando agora
            </h1>
        </div>
    );

    const showCards = () => (
        <Cards
            list={list}
            isLiveTrade
            detectedCard={detectedCard}
            checkDetectedElem={checkDetectedElem}
        />
    );

    const showEmptyIllustration = () => (
        <section className="mx-3 my-5 container-center-col">
            <img
                width={300}
                src="/img/illustrations/empty-data.svg"
                alt="nenhuma negociação"
            />
            <h2 className="mt-3 text-normal font-weight-bold text-grey">
                Negociando nenhum trade agora.
            </h2>
        </section>
    );
    // END DISPLAY

    return (
        <section className="mx-3">
            {showTitle()}
            {needEmptyIllustra && showEmptyIllustration()}
            {showCards()}
            {/*<ShowLoadingSkeleton />*/}
            {error && <ShowError />}
            {/*<ShowOverMsg />*/}
            <div style={{ marginBottom: 150 }} />
        </section>
    );
}

// HELPERS
function useTimer(timeSpan = 1000, options = {}) {
    const { stop = false } = options;

    const [timer, setTimer] = useState(0);

    useEffect(() => {
        const runTime = setInterval(() => {
            setTimer((prev) => prev + 1);
        }, timeSpan);

        if (stop) clearInterval(runTime);

        return () => {
            clearInterval(runTime);
        };
    }, [timeSpan, stop]);

    return timer;
}
// END HELPERS
