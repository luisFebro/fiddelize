import { Fragment, useEffect, useState } from "react";
import SearchField from "components/search/SearchField";
import useData, { useBizData } from "init";
import useAPIList, {
    readBenefitCards,
    benefitCardsAutocomplete,
} from "api/useAPIList";
import useElemDetection, { checkDetectedElem } from "api/useElemDetection";
import useRun, { setRun, useAction } from "global-data/ui";
import PendingCard from "./cards/PendingCard";
// import { setItems } from "init/lStorage";
// import { Load } from "components/code-splitting/LoadableComp";
// import showToast from "components/toasts";

// setItems("global", { lastDatePendingOrderCard: new Date() });

export default function PendingOrdersList() {
    const [skip, setSkip] = useState(0);
    const [search, setSearch] = useState("");
    const { bizId } = useBizData();
    const { userId } = useData();

    const params = {
        type: "pending",
        userId, // for auth
        adminId: bizId,
        search,
    };

    // UPDATE
    const { runName } = useRun(); // for update list from other comps
    const uify = useAction();
    useEffect(() => {
        if (runName && runName.includes("PendingOrdersList")) {
            setSkip(0);
            setSearch("");
            setRun("runName", null, uify);
        }
        // eslint-disable-next-line
    }, [runName, search]);
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
        url: readBenefitCards(),
        skip,
        params,
        listName: "PendingOrdersList",
        filterId: "customerId", // IMPORTANT: this is to avoid duplication. the default is _id, if not found, it will be loading issue. Set here the actual id of each card
        trigger: search || runName || true,
    });

    // SEARCH
    const handleSearch = (entry) => {
        if (entry === "_cleared") {
            setSearch("");
            return;
        }

        setSkip(0);
        setSearch(entry);
    };

    const autocompleteProps = {
        placeholder: "Procure nome cliente",
        noOptionsText: "Cliente não encontrado ou sem benefícios pendentes",
    };

    const showCustomerSearch = () => (
        <Fragment>
            <SearchField
                callback={handleSearch}
                searchUrl={benefitCardsAutocomplete(bizId, {
                    isReceived: false,
                })}
                autocompleteProps={autocompleteProps}
            />
        </Fragment>
    );
    // END SEARCH

    // INFINITY LOADING LIST
    const detectedCard = useElemDetection({
        loading,
        hasMore,
        setSkip,
        isOffline,
    });
    const showCard = (data) => <PendingCard data={data} />;

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
            {!needEmptyIllustra && showCustomerSearch()}
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
