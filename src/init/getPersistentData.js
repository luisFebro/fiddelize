import getItems, { setItems } from "init/lStorage";

// persist a value in local storage - generally an id - that requires to be the same over and over again
export default function getPersistentData(options = {}) {
    const {
        coll = "global",
        name = "chatVisitorId", // variable name
        val = null, // val to persist e.g some nanoId
    } = options;

    if (!name || !val) throw new Error("No val found");

    const [storedData] = getItems(coll, [name]);
    if (!storedData) {
        setItems("global", {
            [name]: val,
        });
        return val;
    }

    return storedData;
}
