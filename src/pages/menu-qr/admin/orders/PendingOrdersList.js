import { useEffect, useState } from "react";
import useData, { useBizData } from "init";
import useAPIList, { readMenuOrderList } from "api/useAPIList";
import useElemDetection, { checkDetectedElem } from "api/useElemDetection";
import useRun, { setRun, useAction } from "global-data/ui";
import getId from "utils/getId";
import PendingCard from "./cards/PendingCard";
// import SearchField from "components/search/SearchField";
// import { setItems } from "init/lStorage";
// import { Load } from "components/code-splitting/LoadableComp";
// import showToast from "components/toasts";

// setItems("global", { lastDatePendingOrderCard: new Date() });

export default function PendingOrdersList({ socket }) {
    const [trigger, setTrigger] = useState(false);
    const [skip, setSkip] = useState(0);
    // const [search, setSearch] = useState("");
    const { bizId } = useBizData();
    const { userId } = useData();

    const params = {
        type: "pending",
        userId, // for auth
        adminId: bizId,
    };

    // UPDATE
    const { runName } = useRun(); // for update list from other comps
    const uify = useAction();
    useEffect(() => {
        if (socket)
            socket.on("updateAdminList", () => {
                setTrigger(getId());
            });
    }, [socket]);

    useEffect(() => {
        if (runName && runName.includes("PendingOrdersList")) {
            setSkip(0);
            // setSearch("");
            setRun("runName", null, uify);
        }
        // eslint-disable-next-line
    }, [runName]);
    // END UPDATE

    const {
        list = [],
        listTotal: ordersCount,
        needEmptyIllustra,
        isPlural,
        hasMore,
        loading,
        ShowLoadingSkeleton,
        error,
        ShowError,
        isOffline,
        ShowOverMsg,
    } = useAPIList({
        url: readMenuOrderList(),
        skip,
        params,
        listName: "PendingOrdersList",
        filterId: "_id", // IMPORTANT: this is to avoid duplication. the default is _id, if not found, it will be loading issue. Set here the actual id of each card
        trigger: trigger || runName || true,
    });

    // INFINITY LOADING LIST
    const detectedCard = useElemDetection({
        loading,
        hasMore,
        setSkip,
        isOffline,
    });
    const showCard = (data) => <PendingCard data={data} socket={socket} />;

    const listMap = list.map((data, ind) =>
        checkDetectedElem({ list, ind, indFromLast: 2 }) ? (
            <section key={data._id} ref={detectedCard}>
                {showCard(data)}
            </section>
        ) : (
            <section key={data._id}>{showCard(data)}</section>
        )
    );
    // END INFINITY LOADING LIST

    const showEmptyIllustration = () => (
        <section className="mx-3 my-5 container-center-col">
            <img
                width={300}
                src="/img/illustrations/empty-content.svg"
                alt="nenhum benefício"
            />
            <h2 className="mt-3 text-normal font-weight-bold text-grey">
                Nenhum pedido pendente.
            </h2>
        </section>
    );

    return (
        <section className="text-purple mx-3">
            {Boolean(ordersCount) && (
                <h2 className="my-3 text-normal font-weight-bold text-center">
                    <span className="text-subtitle font-weight-bold">
                        Total: {ordersCount} pedido{isPlural}.
                    </span>{" "}
                </h2>
            )}
            {listMap}
            {loading && <ShowLoadingSkeleton />}
            {needEmptyIllustra && showEmptyIllustration()}
            {error && <ShowError />}
            <ShowOverMsg />
        </section>
    );
}
