import { useEffect, useState } from "react";
import { setVar, getVar, store } from "./useVar";
import { useStoreState } from "easy-peasy";

export const useOfflineData = ({ dataName, data, trigger }) => {
    const [dataOff, setDataOff] = useState({
        offlineData: null,
        loading: true,
        already: false,
    });
    const { offlineData, loading, already } = dataOff;

    const { isOnline } = useStoreState((state) => ({
        isOnline: state.authReducer.cases.isUserOnline,
    }));

    useEffect(() => {
        if (!dataName || trigger === false) return;

        setDataOff({ ...dataOff, loading: true });

        if (data && isOnline) {
            setVar({ [dataName]: data }, store.request_api_data);
        }

        if ((!isOnline || trigger) && !already) {
            getVar(dataName, store.request_api_data).then((offData) => {
                setDataOff({
                    ...dataOff,
                    offlineData: offData,
                    loading: false,
                    already: true,
                });
            });
        }

        return () => null;
    }, [data, dataName, isOnline, trigger, dataOff, already]);

    const isOffline = Boolean(!isOnline && data);

    return { isOffline, offlineData, loading };
};

export default function useOfflineListData({ listName, list, trigger }) {
    const [offlineList, setOfflineList] = useState(null);
    const [already, setAlready] = useState(false);

    const { isOnline } = useStoreState((state) => ({
        isOnline: state.authReducer.cases.isUserOnline,
    }));

    useEffect(() => {
        if (!listName) return;

        const gotItemsList = list && list.length;
        if (gotItemsList && isOnline) {
            setVar({ [listName]: list }, store.offline_lists);
        }

        if ((!isOnline || trigger) && !already) {
            getVar(listName, store.offline_lists).then((offList) => {
                setOfflineList(offList);
                setAlready(true);
            });
        }

        return () => null;
    }, [list, listName, isOnline, trigger, already]);

    const hasListItems = offlineList && offlineList.length;
    const isOffline = Boolean(!isOnline && hasListItems);

    return { isOffline, offlineList };
}
