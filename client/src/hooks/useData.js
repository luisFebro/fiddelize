import React, { useEffect, useState } from "react";
import { getMultiVar, store as st } from "./storage/useVar";
import repeat from "../utils/arrays/repeat";

export default function useData(data) {
    const [store, setStore] = useState([]);

    if (!Array.isArray(data)) throw new Error("Requires a array data format");

    useEffect(() => {
        if (data) {
            (async () => {
                const dataArray = await getMultiVar(data, st.user).catch(
                    (err) => "ERROR: " + err
                );
                if (dataArray) setStore(dataArray);
            })();
        }
    }, []);

    // this will automatically set a ... for data loading
    if (!store.length) {
        return repeat(data.length, { placeholder: "..." });
    }

    return store;
}
