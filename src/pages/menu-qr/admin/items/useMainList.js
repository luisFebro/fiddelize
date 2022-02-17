import { useState, useEffect } from "react";
import SearchField from "components/search/SearchField";
import { useBizData } from "init";
import useAPIList, {
    readMainItemList,
    digitalMenuAutocomplete,
} from "api/useAPIList";
import useElemDetection from "api/useElemDetection";
import useRun, { setRun, useAction } from "global-data/ui";
import getId from "utils/getId";

export default function useMainList(options = {}) {
    // adminId only for customer catalog
    const { limit = 15, adminId, isAdmin } = options;

    const [skip, setSkip] = useState(0);
    const [search, setSearch] = useState("");
    const { bizId } = useBizData();

    const params = {
        adminId: adminId || bizId,
        search,
        isAdmin: isAdmin ? "1" : undefined,
    };

    // UPDATE
    const { runName } = useRun(); // for update list from other comps
    const uify = useAction();
    useEffect(() => {
        if (runName && runName.includes("AdminCatalog")) {
            setSkip(0);
            setSearch("");
            setRun("runName", null, uify);
        }
        // eslint-disable-next-line
    }, [runName, search]);
    // END UPDATE
    const trigger = search || runName || true;

    const dataList = useAPIList({
        url: readMainItemList(),
        skip,
        limit,
        params,
        trigger, // search shoulb be the first, otherwise it will not trigger if other static value is in front.
        listName: "MenuDigitalList", // for offline list only
    });

    const updateAdminCatalog = () => {
        setRun("runName", `AdminCatalog${getId()}`, uify);
    };

    // SEARCH
    const handleSearch = (entry) => {
        if (entry === "_cleared") {
            setSearch("");
            return;
        }

        setSkip(0);
        setSearch(entry);
    };

    // const [clearField, setClearField] = useState(false);

    // const runClearField = () => {
    //     setClearField(true);
    //     setSkip(0);
    //     setSearch("");
    // }

    const autocompleteProps = {
        placeholder: "Procure um item",
        noOptionsText: "Item não encontrado",
        clearField: true,
    };

    const showSearchField = () => (
        <section className="mt-2">
            <SearchField
                callback={handleSearch}
                searchUrl={digitalMenuAutocomplete(bizId, {
                    limit: 5,
                    isAdmin,
                })}
                autocompleteProps={autocompleteProps}
                showImgs
            />
        </section>
    );
    // END SEARCH

    // INFINITY LOADING LIST
    const detectedCard = useElemDetection({
        loading: dataList && dataList.loading,
        hasMore: dataList && dataList.hasMore,
        isOffline: dataList && dataList.isOffline,
        setSkip,
    });
    // const showCard = (data) => <DoneCard data={data} />;

    // const listMap = list.map((data, ind) =>
    //     checkDetectedElem({ list, ind, indFromLast: 2 }) ? (
    //         <section key={data.recordId} ref={detectedCard}>
    //             {showCard(data)}
    //         </section>
    //     ) : (
    //         <section key={data.recordId}>{showCard(data)}</section>
    //     )
    // );
    // END INFINITY LOADING LIST

    // const showEmptyIllustration = () => (
    //     <section className="mx-3 my-5 container-center-col">
    //         <img
    //             width={300}
    //             src="/img/illustrations/empty-benefits.svg"
    //             alt="nenhum benefício"
    //         />
    //         <h2 className="mt-3 text-normal font-weight-bold text-grey">
    //             Nenhum benefício realizado.
    //         </h2>
    //     </section>
    // );

    return {
        skip,
        detectedCard,
        showSearchField,
        dataList,
        search,
        updateAdminCatalog,
    };
}
