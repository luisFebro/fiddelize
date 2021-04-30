import { useEffect, useState } from "react";
import { useStoreState } from "easy-peasy";
import { getMultiVar, store as st } from "hooks/storage/useVar";
import repeat from "utils/arrays/repeat";

export const sto = {
    re: st,
};

export default function useData(data, options = {}) {
    const { trigger = true, dots = true, storeName = "user" } = options;

    const [store, setStore] = useState([]);

    if (!Array.isArray(data)) throw new Error("Requires an array data format");

    useEffect(() => {
        let unmounted;
        if (data && trigger && !unmounted) {
            (async () => {
                const dataArray = await getMultiVar(data, st[storeName]).catch(
                    (err) => {
                        console.log(`ERROR: ${err}`);
                    }
                );
                if (dataArray) setStore(dataArray);
            })();
        }

        return () => {
            unmounted = true;
        };
    }, [trigger, storeName]);

    // this will automatically set a ... for data loading
    if (dots && trigger && !store.length) {
        return repeat(data.length, { placeholder: "..." });
    }

    return store;
}

export function useBizData() {
    const bizData = useStoreState((state) => state.userReducer.cases.bizData);

    return {
        ...bizData,
        selfThemePColor: bizData.selfThemePColor || "default",
        selfThemeSColor: bizData.selfThemeSColor || "default",
        selfThemeBackColor: bizData.selfThemeBackColor || "default",
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
