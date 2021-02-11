import { useEffect, useState } from "react";
import { getMultiVar, store as st } from "./storage/useVar";
import repeat from "../utils/arrays/repeat";

export const sto = {
    re: st,
};

// IMPORTANT LESSON: insert data in the useEffect's dependency array causes maximum  update depth exceeded error
// do not insert fucking frequently changing obj.
export default function useData(data, options = {}) {
    const { trigger = true, dots = true, storeName = "user" } = options;

    const [store, setStore] = useState([]);
    const [done, setDone] = useState(false);

    if (!Array.isArray(data)) throw new Error("Requires a array data format");

    useEffect(() => {
        let unmounted;
        if (data && trigger && !unmounted && !done) {
            (async () => {
                const dataArray = await getMultiVar(data, st[storeName]).catch(
                    (err) => {
                        console.log("ERROR: " + err);
                    }
                );
                if (dataArray) {
                    await setStore(dataArray);
                    setDone(true);
                }
            })();
        }

        return () => {
            unmounted = true;
        };
    }, [trigger, storeName, data, done]);
    // eslint-disable-next-line

    // this will automatically set a ... for data loading
    if (dots && trigger && !store.length) {
        return repeat(data.length, { placeholder: "..." });
    }

    return store;
}
