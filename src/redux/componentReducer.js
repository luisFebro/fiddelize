import { reducer } from "easy-peasy";
import isThisApp from "../utils/window/isThisApp";

// REDUCERS
// currentComp options: login, purchaseValue, staffConfirmation, clientScoresPanel
const initialState = {
    currentComp: isThisApp() ? "purchaseValue" : "login",
    currentCompSet2: "?",
};

export const componentReducer = {
    cases: reducer((state = initialState, action) => {
        switch (action.type) {
            case "COMPONENT_DISPLAYED":
                return {
                    ...state,
                    currentComp: action.payload,
                };
            case "COMPONENT_SET2_DISPLAYED":
                return {
                    ...state,
                    currentCompSet2: action.payload,
                };
            default:
                return state;
        }
    }),
};
