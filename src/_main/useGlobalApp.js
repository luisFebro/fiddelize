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
    ...legacyEasyPeasy,
};

const reducer = (state, action) => {
    const [type, payload] = handleAction(action, initState);

    if (type === "currUser") return { ...state, currUser: payload };
    if (type === "bizData") return { ...state, bizData: payload };
    if (type === "run") return { ...state, run: !state.run };
    if (type === "runName")
        return { ...state, runName: payload && payload.toString() };
    if (type === "runName2") return { ...state, runName2: payload };
    if (type === "runOneArray") return { ...state, runOneArray: payload };
    if (type === "runArray") {
        const prior = state.runArray;

        return {
            ...state,
            runArray: [...prior, ...payload],
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
