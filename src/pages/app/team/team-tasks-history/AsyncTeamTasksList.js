import { useEffect, useState } from "react";
import useData, { useBizData } from "init";
import useAPIList, {
    readTeamTaskList,
    teamAutocomplete,
    watchTrigger,
} from "api/useAPIList";
import useElemDetection, { checkDetectedElem } from "api/useElemDetection";
import useRun from "global-data/ui";
import SearchField from "components/search/SearchField";
import Cards from "./card/Cards";
import TeamTasksFilter from "./TeamTasksFilter";
// import extractStrData from '../../../../../../utils/string/extractStrData';
// import { isScheduledDate } from '../../../../../../utils/dates/dateFns';

export default function AsyncTeamTasksList({
    needTitle = true,
    isAdmin = false,
}) {
    const [skip, setSkip] = useState(0);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");

    const { bizId } = useBizData();
    const { userId: staffId, name } = useData();

    const params = {
        isAdmin,
        userId: staffId, // for token check
        memberId: isAdmin ? undefined : staffId,
        bizId,
        search,
        filter: filter || "today", // filter should be empty to avoid duplicate request...
        skip,
        limit: 5,
    };

    // UPDATE
    const { runName } = useRun(); // for update list from other comps
    const comp = "TeamTasksList"; // NOT BEING USED FOR NOW

    const trigger = watchTrigger({
        runName,
        comp,
        triggerVars: `${filter}_${search}`,
    });

    useClearSkip({
        filter,
        search,
        runName,
        setSkip,
    });
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
        url: readTeamTaskList(),
        skip,
        params,
        filterId: "createdAt",
        listName: "teamTasksList",
        trigger,
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

    const subject = isAdmin ? "membro" : "cliente";
    const autocompleteProps = {
        placeholder: `Procure um ${subject}`,
        noOptionsText: `${subject.cap()} não encontrado`,
    };

    const showCustomerSearch = () => (
        <section className="animated fadeInUp">
            <SearchField
                callback={handleSearch}
                searchUrl={teamAutocomplete(bizId, {
                    adminName: isAdmin ? name : null,
                    memberId: isAdmin ? null : staffId,
                    isAdmin,
                })}
                autocompleteProps={autocompleteProps}
            />
        </section>
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
                offlineKey={
                    isAdmin
                        ? "selectedPeriodFilter_adminTasksHistory"
                        : "selectedPeriodFilter_memberTasksHistory"
                }
                listTotal={listTotal}
                handlePeriodFilter={handlePeriodFilter}
                loading={loading}
                show={!search}
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
        <section className="mx-3 mb-5 container-center-col">
            <img
                width={300}
                src={"/img/illustrations/empty-data.svg" || "/img/error.png"}
                alt="sem tarefas recentes"
            />
            <h2 className="text-normal font-weight-bold text-grey">
                Nenhuma tarefa {filter === "today" ? "feita hoje" : "até agora"}
            </h2>
        </section>
    );

    const showCards = () => (
        <Cards
            list={list}
            isAdmin={isAdmin}
            detectedCard={detectedCard}
            checkDetectedElem={checkDetectedElem}
        />
    );
    // END DISPLAY

    return (
        <section className="mx-3">
            {needTitle && showTitle()}
            {!needEmptyIllustra && filter === "all" && showCustomerSearch()}
            {showFilter()}
            {showCards()}
            {loading && <ShowLoadingSkeleton />}
            {needEmptyIllustra && showEmptyIllustration()}
            {error && <ShowError />}
            <ShowOverMsg />
        </section>
    );
}

// HOOKS
function useClearSkip({ runName, filter, search, setSkip }) {
    useEffect(() => {
        if (filter || runName || search) setSkip(0);
        // eslint-disable-next-line
    }, [runName, search, filter]);
}

// END HOOKS
