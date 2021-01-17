import React, { useEffect, useState } from "react";
import { getMultiVar, store as st } from "./storage/useVar";
import repeat from "../utils/arrays/repeat";

export default function useData(data, options = {}) {
    const { trigger = true, dots = true, storeName = "user" } = options;

    const [store, setStore] = useState([]);

    if (!Array.isArray(data)) throw new Error("Requires a array data format");

    useEffect(() => {
        let unmounted;
        if (data && trigger && !unmounted) {
            (async () => {
                const dataArray = await getMultiVar(data, st[storeName]).catch(
                    (err) => {
                        console.log("ERROR: " + err);
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
