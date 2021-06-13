import { useState } from "react";
import SearchField from "components/search/SearchField";
import useData, { useBizData } from "init";
import useAPIList, {
    readBenefitCards,
    benefitCardsAutocomplete,
} from "api/useAPIList";
import useElemDetection, { checkDetectedElem } from "api/useElemDetection";
import useRun from "global-data/ui";
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

    const { runName } = useRun();

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
        ShowOverMsg,
    } = useAPIList({
        url: readBenefitCards(),
        skip,
        params,
        listName: "PendingBenefitsList",
        limit: 10,
        trigger: runName || true,
    });

    // SEARCH
    const handleSearch = (entry) => {
        if (entry === "_cleared") return setSearch("");
        return setSearch(entry);
    };

    const autocompleteProps = {
        placeholder: "Procure nome cliente",
        noOptionsText: "Cliente não encontrado ou não recebeu benefícios",
    };

    const showCustomerSearch = () => (
        <SearchField
            callback={handleSearch}
            searchUrl={benefitCardsAutocomplete(bizId)}
            autocompleteProps={autocompleteProps}
        />
    );
    // END SEARCH

    // INFINITY LOADING LIST
    const detectedCard = useElemDetection({ loading, hasMore, setSkip });
    const showCard = (data) => <DoneCard data={data} />;

    const listMap = list.map((data, ind) =>
        checkDetectedElem({ list, ind, indFromLast: 3 }) ? (
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
