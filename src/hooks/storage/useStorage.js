import { useEffect, useState } from "react";
import getVar, { setVar } from "init/var";

// Useful for actions which require only one action in the app like instructions and so on...
export default function useStorage({
    key,
    value = true,
    trigger,
    storeName = "once_checked", // global_variables for everything else
}) {
    const [storageData, setStorageData] = useState({
        data: null,
        loading: true,
        already: false,
    });
    const { data, loading, already } = storageData;

    useEffect(() => {
        if (!key) return;

        setStorageData({ ...storageData, loading: true });

        if (!already) {
            getVar(key, storeName).then((thisData) => {
                if (!thisData) {
                    setStorageData({
                        ...storageData,
                        data: false,
                        already: true,
                        loading: false,
                    });
                } else {
                    setStorageData({
                        ...storageData,
                        data: true,
                        loading: false,
                        already: true,
                    });
                }
            });
        }

        if (trigger) {
            setVar({ [key]: value }, storeName);
        }

        return () => null;
    }, [key, value, trigger]);

    const gotData = !loading && data;

    return { data, loading, gotData };
}
