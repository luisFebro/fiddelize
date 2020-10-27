import React, { useEffect, useState } from "react";
import { getMultiVar, store as st } from "./storage/useVar";
import repeat from "../utils/arrays/repeat";

export default function useData(data, options = {}) {
    const { trigger = true } = options;

    const [store, setStore] = useState([]);

    if (!Array.isArray(data)) throw new Error("Requires a array data format");

    useEffect(() => {
        if (data && trigger) {
            (async () => {
                const dataArray = await getMultiVar(data, st.user).catch(
                    (err) => {
                        console.log("ERROR: " + err);
                    }
                );
                if (dataArray) setStore(dataArray);
            })();
        }
    }, [trigger]);

    // this will automatically set a ... for data loading
    if (trigger && !store.length) {
        return repeat(data.length, { placeholder: "..." });
    }

    return store;
}
