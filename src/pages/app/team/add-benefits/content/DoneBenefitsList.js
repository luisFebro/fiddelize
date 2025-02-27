import { useState, useEffect } from "react";
import SearchField from "components/search/SearchField";
import useData, { useBizData } from "init";
import useAPIList, {
    readBenefitCards,
    benefitCardsAutocomplete,
} from "api/useAPIList";
import useElemDetection, { checkDetectedElem } from "api/useElemDetection";
import useRun, { setRun, useAction } from "global-data/ui";
import DoneCard from "./cards/DoneCard";

export default function DoneBenefitsList() {
    const [skip, setSkip] = useState(0);
    const [search, setSearch] = useState("");
    const { bizId } = useBizData();
    const { userId } = useData();

    const params = {
        type: "done",
        userId, // for auth
        adminId: bizId,
        search,
    };

    // UPDATE
    const { runName } = useRun(); // for update list from other comps
    const uify = useAction();
    useEffect(() => {
        if (runName && runName.includes("DoneBenefitsList")) {
            setSkip(0);
            setSearch("");
            setRun("runName", null, uify);
        }
        // eslint-disable-next-line
    }, [runName, search]);
    // END UPDATE

    const {
        list = [],
        listTotal: benefitsCount,
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
        listName: "DoneBenefitsList",
        disableDupFilter: true,
        trigger: search || runName || true, // search shoulb be the first, otherwise it will not trigger if other static value is in front.
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
        noOptionsText: "Cliente não encontrado ou não recebeu benefícios",
    };

    const showCustomerSearch = () => (
        <section className="animated fadeInUp">
            <SearchField
                callback={handleSearch}
                searchUrl={benefitCardsAutocomplete(bizId, {
                    isReceived: true,
                })}
                autocompleteProps={autocompleteProps}
            />
        </section>
    );
    // END SEARCH

    // INFINITY LOADING LIST
    const detectedCard = useElemDetection({
        loading,
        hasMore,
        setSkip,
        isOffline,
    });
    const showCard = (data) => <DoneCard data={data} />;

    const listMap = list.map((data, ind) =>
        checkDetectedElem({ list, ind, indFromLast: 2 }) ? (
            <section key={data.recordId} ref={detectedCard}>
                {showCard(data)}
            </section>
        ) : (
            <section key={data.recordId}>{showCard(data)}</section>
        )
    );
    // END INFINITY LOADING LIST

    const showEmptyIllustration = () => (
        <section className="mx-3 my-5 container-center-col">
            <img
                width={300}
                src="/img/illustrations/empty-benefits.svg"
                alt="nenhum benefício"
            />
            <h2 className="mt-3 text-normal font-weight-bold text-grey">
                Nenhum benefício realizado.
            </h2>
        </section>
    );

    return (
        <section className="text-purple mx-3">
            {!needEmptyIllustra && showCustomerSearch()}
            {Boolean(benefitsCount) && (
                <h2 className="my-3 text-normal font-weight-bold text-center">
                    <span className="text-subtitle font-weight-bold">
                        {benefitsCount} benefício{isPlural}
                    </span>{" "}
                    recebido{isPlural}.
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
