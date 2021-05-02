import { useUify } from "context";

const initialState = {
    currUser: {},
    bizData: {},
};

const allowedTypes = Object.keys(initialState);

const reducer = (state, action = []) => {
    console.log("action", action);
    const [type, payload] = action;
    if (!allowedTypes.includes(type))
        throw new Error(`the action ${type.toUpperCase()} is not allowed`);

    if (type === "currUser") return { ...state, currUser: payload };
    if (type === "bizData") return { ...state, bizData: payload };

    return state;
};

// ONLY FOR INIT AND AUTH DATA.
// useUify can be used in other specif man components though
export default function useGlobalApp() {
    const dataUify = useUify(reducer, initialState);
    return dataUify;
}
