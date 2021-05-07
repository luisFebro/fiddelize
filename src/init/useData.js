import { useMemo, useEffect, useState } from "react";
import { getVars } from "init/var";
import getItems from "init/lStorage";
import repeat from "utils/arrays/repeat";
import { useGlobalContext } from "context";
import useRun from "global-data/ui";

// USAGE
// localStorage = simply use an empty function. e.g const { role } = useData();
// indexedDB = use an array of strings = const [userRole] = useData(["role"]);
export default function useData(dataArray, options) {
    const globalData = useGlobalContext();
    const currUser = globalData ? globalData.currUser : {};
    const { store, trigger, dots, local } = handleOptions(dataArray, options);

    // eslint-disable-next-line
    const thisArray = useMemo(() => dataArray, []);

    // LESSON: this condition is responsible to update indexedDB data in bootup
    const updateIndexedDB = Boolean(currUser.userId);

    const finalData = useIndexedLoader({
        thisArray,
        trigger,
        store,
        local,
        updateIndexedDB,
    });

    if (local) return updateLocalStorage("currUser", { currData: currUser });

    // this will automatically set a ... for dataArray loading
    const isLoading = !finalData.length;
    const arrayPattern = repeat(dataArray.length, { placeholder: dots });

    // the last value is always the loading status.
    return isLoading ? [...arrayPattern, true] : [...finalData, false];
}

export function useBizData() {
    // TEST
    const dataUSESTORE = useRun();
    console.log("dataUSESTORE", dataUSESTORE);

    const globalData = useGlobalContext();
    const bizData = globalData ? globalData.bizData : {};

    const updatedBizData = updateLocalStorage("bizData", { currData: bizData });

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
function useIndexedLoader({
    thisArray,
    trigger,
    store,
    local,
    updateIndexedDB,
}) {
    const [finalData, setFinalData] = useState([]);

    useEffect(() => {
        let unmounted;
        if (local || (thisArray && !thisArray.length) || !trigger || unmounted)
            return null;

        (async () => {
            const updatedIndexedDB = await getVars(thisArray, store).catch(
                (err) => {
                    throw new Error(`${err}`);
                }
            );

            setFinalData(updatedIndexedDB);

            return null;
        })();

        return () => {
            unmounted = true;
        };
    }, [thisArray, trigger, store, local, updateIndexedDB]);

    return finalData;
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
        store = options.store || "user";
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

function updateLocalStorage(collection, { currData }) {
    const [priorData] = getItems(collection);
    const updatedData = { ...priorData, ...currData };

    return updatedData;
}
// END HELPERS
