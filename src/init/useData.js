import React, { useEffect, useState } from "react";
import { useStoreState } from "easy-peasy";
import { getVars } from "init/var";
import { getItems } from "init/lStorage";
import repeat from "utils/arrays/repeat";

export default function useData(dataArray = [], options) {
    let storeName = options || "user";
    let trigger = true;
    let dots = "...";
    let local = false; // fetch data from localstorage

    if (typeof options === "object") {
        storeName = options.storeName;
        trigger = options.trigger === undefined ? true : options.trigger;
        dots = options.dots === false ? null : dots;
        local = options.local;
    }

    const [finalData, setFinalData] = useState([]);

    if (!Array.isArray(dataArray))
        throw new Error("Requires an array data format");

    // eslint-disable-next-line
    const thisArray = React.useMemo(() => dataArray, []);

    useEffect(() => {
        let unmounted;
        if (!thisArray.length || !trigger || unmounted) return null;

        if (local) {
            const localRes = getItems("currUser", thisArray);
            return setFinalData(localRes);
        }

        (async () => {
            const indexedRes = await getVars(thisArray, storeName).catch(
                (err) => {
                    throw new Error(`${err}`);
                }
            );

            if (indexedRes) setFinalData(indexedRes);
        })();

        return () => {
            unmounted = true;
        };
    }, [thisArray, trigger, storeName, local]);

    // this will automatically set a ... for dataArray loading
    const isLoading = !finalData.length;
    const arrayPattern = repeat(dataArray.length, { placeholder: dots });

    // the last value is always the loading status.
    return isLoading ? [...arrayPattern, true] : [...finalData, false];
}

export function useBizData() {
    const bizData = useStoreState((state) => state.userReducer.cases.bizData);

    return {
        ...bizData,
        themePColor: bizData.themePColor || "default",
        themeSColor: bizData.themeSColor || "default",
        themeBackColor: bizData.themeBackColor || "default",
    };
}

export function useProfile() {
    const currUser = useStoreState((state) => state.userReducer.cases.currUser);

    return currUser;
}

export function useFiddelizeAdmin() {
    const LIMIT_FREE_PLAN_NEW_USERS = 10;
    const MAIN_TECH_WHATSAPP = "(92) 99281-7363";

    return {
        limitFreePlanNewUsers: LIMIT_FREE_PLAN_NEW_USERS,
        mainTechWhatsapp: MAIN_TECH_WHATSAPP,
    };
}
