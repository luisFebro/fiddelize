import React, { useEffect, useState } from "react";
import { getVars } from "init/var";
import { getItems } from "init/lStorage";
import repeat from "utils/arrays/repeat";
import useContext from "context";

// USAGE
// localStorage = simply use an empty function. e.g const { role } = useData();
// indexedDB = use an array of strings = const [userRole] = useData(["role"]);
export default function useData(dataArray, options) {
    const { store, trigger, dots, local } = handleOptions(dataArray, options);

    const [finalData, setFinalData] = useState([]);

    // eslint-disable-next-line
    const thisArray = React.useMemo(() => dataArray, []);

    useIndexedLoader({
        thisArray,
        trigger,
        store,
        local,
        setFinalData,
    });

    if (local) return handleLocalStorage();

    // this will automatically set a ... for dataArray loading
    const isLoading = !finalData.length;
    const arrayPattern = repeat(dataArray.length, { placeholder: dots });

    // the last value is always the loading status.
    return isLoading ? [...arrayPattern, true] : [...finalData, false];
}

export function useBizData() {
    const { bizData = {} } = useContext();
    const [priorBizData] = getItems("bizData");

    const updatedBizData = { ...priorBizData, ...bizData };

    return {
        ...updatedBizData,
        themePColor: updatedBizData.themePColor || "default",
        themeSColor: updatedBizData.themeSColor || "default",
        themeBackColor: updatedBizData.themeBackColor || "default",
    };
}

export function useFiddelizeAdmin() {
    const LIMIT_FREE_PLAN_NEW_USERS = 10;
    const MAIN_TECH_WHATSAPP = "(92) 99281-7363";

    return {
        limitFreePlanNewUsers: LIMIT_FREE_PLAN_NEW_USERS,
        mainTechWhatsapp: MAIN_TECH_WHATSAPP,
    };
}

// HOOKS
function useIndexedLoader({ thisArray, trigger, store, local, setFinalData }) {
    useEffect(() => {
        let unmounted;
        if (local || (thisArray && !thisArray.length) || !trigger || unmounted)
            return null;

        (async () => {
            const indexedRes = await getVars(thisArray, store).catch((err) => {
                throw new Error(`${err}`);
            });

            if (indexedRes) setFinalData(indexedRes);
        })();

        return () => {
            unmounted = true;
        };
    }, [thisArray, trigger, store, local]);
}
// END HOOKS

// HELPERS
function handleOptions(dataArray, options) {
    if (!Array.isArray(dataArray) && dataArray !== undefined)
        throw new Error("Requires an array data format");

    let store = options || "user";
    let trigger = true;
    let dots = "...";
    const local = dataArray === undefined; // fetch data from localstorage

    if (typeof options === "object") {
        store = options.store;
        trigger = options.trigger === undefined ? true : options.trigger;
        dots = options.dots === false ? null : dots;
    }

    return {
        store,
        trigger,
        dots,
        local,
    };
}

function handleLocalStorage() {
    const [localRes] = getItems("currUser");
    return !localRes ? {} : localRes;
}
// END HELPERS
