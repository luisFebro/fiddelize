import { useEffect, useState } from "react";
import useData, { useBizData } from "init";
import useAPIList, {
    readOneMemberTasksList,
    teamAutocomplete,
} from "api/useAPIList";
import useElemDetection, { checkDetectedElem } from "api/useElemDetection";
import useRun from "global-data/ui";
import SearchField from "components/search/SearchField";
import Cards from "./card/Cards";
import TeamTasksFilter from "./TeamTasksFilter";
// import extractStrData from '../../../../../../utils/string/extractStrData';
// import { isScheduledDate } from '../../../../../../utils/dates/dateFns';

export default function AsyncTeamTasksList() {
    const [skip, setSkip] = useState(0);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");

    const { bizId } = useBizData();
    const { userId: memberId } = useData();

    const params = {
        userId: memberId, // for token check
        memberId,
        bizId,
        search,
        filter: filter || "all",
        skip,
        limit: 5,
    };

    // UPDATE
    const { runName: updateName } = useRun(); // for update list from other comps
    const [runName, setRunName] = useState(updateName);
    useEffect(() => {
        if (filter) {
            setSkip(0);
            // setSearch("");
            setRunName("");
        }
        if (runName) {
            setSkip(0);
            // setSearch("");
        }
    }, [runName, search, filter]);
    // END UPDATE

    const {
        list,
        loading,
        ShowLoadingSkeleton,
        error,
        ShowError,
        needEmptyIllustra,
        hasMore,
        isOffline,
        ShowOverMsg,
        listTotal,
        gotData,
    } = useAPIList({
        url: readOneMemberTasksList(),
        skip,
        params,
        filterId: "createdAt",
        listName: "teamTasksList",
        trigger: search || runName || filter, // filter should be last since there's a value
    });

    // SEARCH
    const handleSearch = (entry) => {
        if (entry === "_cleared") {
            setSearch("");
            setSkip(0);
            return null;
        }
        return setSearch(entry);
    };

    const autocompleteProps = {
        placeholder: "Procure um cliente",
        noOptionsText: "Cliente não encontrado",
    };

    const showCustomerSearch = () => (
        <SearchField
            callback={handleSearch}
            searchUrl={teamAutocomplete(bizId, { memberId, isAdmin: false })}
            autocompleteProps={autocompleteProps}
        />
    );
    // END SEARCH

    // FILTER
    const showFilter = () => {
        const handlePeriodFilter = (dataFilter) => {
            setFilter(dataFilter.selected);
        };

        return (
            <TeamTasksFilter
                gotData={gotData}
                listTotal={listTotal}
                handlePeriodFilter={handlePeriodFilter}
                loading={loading}
            />
        );
    };
    // END FILTER

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
        <div className="my-4">
            <h1 className="text-subtitle text-purple text-center font-weight-bold">
                Tarefas Recentes
            </h1>
        </div>
    );

    const showEmptyIllustration = () => (
        <section className="mx-3 my-5 container-center-col">
            <img
                width={300}
                src={"/img/illustrations/empty-data.svg" || "/img/error.png"}
                alt="sem tarefas recentes"
            />
            <h2 className="mt-3 text-normal font-weight-bold text-grey">
                Nenhuma tarefa {filter === "today" ? "para hoje" : "até agora"}
            </h2>
        </section>
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
            {!needEmptyIllustra && showCustomerSearch()}
            {showFilter()}
            {showCards()}
            {loading && <ShowLoadingSkeleton />}
            {needEmptyIllustra && showEmptyIllustration()}
            {error && <ShowError />}
            <ShowOverMsg />
        </section>
    );
}
