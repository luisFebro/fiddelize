import { useUify, handleAction } from "context";

const legacyEasyPeasy = {
    run: false,
    runName: "",
    runName2: "",
    runArray: [], // for history of executed elements...
    runOneArray: [],
};

const initState = {
    currUser: {},
    bizData: {},
    global: {},
    ...legacyEasyPeasy,
};

const reducer = (state, action) => {
    const [type, payload] = handleAction(action, initState);

    if (type === "currUser")
        return { ...state, currUser: { ...state.currUser, ...payload } }; // inner ...state.currUser so that variables can be inserted individually when updating data with updateUser.
    if (type === "bizData")
        return { ...state, bizData: { ...state.bizData, ...payload } };
    // al other types of data (use scarcely, only in the last case for transfering data from distant components)
    if (type === "global")
        return { ...state, global: { ...state.global, ...payload } };

    if (type === "run") return { ...state, run: !state.run };
    if (type === "runName")
        return { ...state, runName: payload && payload.toString() };
    if (type === "runName2") return { ...state, runName2: payload };
    if (type === "runOneArray") return { ...state, runOneArray: payload };
    if (type === "runArray") {
        const prior = state.runArray;

        return {
            ...state,
            runArray: [...new Set([...prior, payload])],
        };
    }
    return state;
};

// ONLY FOR INIT AND AUTH DATA.
// useUify can be used in other specif man components though
// useUify return the state and the uify (or dispatch to be used with useContext in any component)
export default function useGlobalApp() {
    return useUify(reducer, initState);
}
