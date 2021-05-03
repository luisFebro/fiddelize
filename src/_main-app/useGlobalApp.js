import { useUify, handleAction } from "context";

const initState = {
    currUser: {},
    bizData: {},
};

const reducer = (state, action) => {
    const [type, payload] = handleAction(action, initState);

    if (type === "currUser") return { ...state, currUser: payload };
    if (type === "bizData") return { ...state, bizData: payload };
    return state;
};

// ONLY FOR INIT AND AUTH DATA.
// useUify can be used in other specif man components though
// useUify return the state and the uify (or dispatch to be used with useContext in any component)
export default function useGlobalApp() {
    return useUify(reducer, initState);
}
