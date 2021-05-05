import { useEffect, useState } from "react";
import getVar, { setVar } from "init/var";
import isOffline from "utils/server/isOffline";

const isOnline = !isOffline();

export const useOfflineData = ({ dataName, data, trigger }) => {
    const [dataOff, setDataOff] = useState({
        offlineData: null,
        loading: true,
        already: false,
    });
    const { offlineData, loading, already } = dataOff;

    useEffect(() => {
        if (!dataName || trigger === false) return;

        setDataOff({ ...dataOff, loading: true });

        if (data && isOnline) {
            setVar({ [dataName]: data }, "request_api_data");
        }

        if ((!isOnline || trigger) && !already) {
            getVar(dataName, "request_api_data").then((offData) => {
                setDataOff({
                    ...dataOff,
                    offlineData: offData,
                    loading: false,
                    already: true,
                });
            });
        }

        return () => null;
    }, [data, dataName, isOnline, trigger]);

    const isOffline = Boolean(!isOnline && data);

    return { isOffline, offlineData, loading };
};

export default function useOfflineListData({ listName, list, trigger }) {
    const [offlineList, setOfflineList] = useState(null);
    const [already, setAlready] = useState(false);

    useEffect(() => {
        if (!listName) return;

        const gotItemsList = list && list.length;
        if (gotItemsList && isOnline) {
            setVar({ [listName]: list }, "offline_lists");
        }

        if ((!isOnline || trigger) && !already) {
            getVar(listName, "offline_lists").then((offList) => {
                setOfflineList(offList);
                setAlready(true);
            });
        }

        return () => null;
    }, [list, listName, isOnline, trigger]);

    const hasListItems = offlineList && offlineList.length;
    const isOffline = Boolean(!isOnline && hasListItems);

    return { isOffline, offlineList };
}
