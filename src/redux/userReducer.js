import { reducer } from "easy-peasy";
import { getItems } from "init/lStorage";

const [currUser] = getItems("currUser");
const [bizData] = getItems("bizData");

// REDUCERS
const initialState = {
    bizData: !bizData ? {} : bizData,
    currUser: !currUser ? {} : currUser,
};

export const userReducer = {
    cases: reducer((state = initialState, action) => {
        switch (action.type) {
            case "CLIENT_ADMIN_READ":
                return {
                    ...state,
                    bizData: action.payload,
                };
            case "USER_READ":
                return {
                    ...state,
                    currentUser: action.payload,
                };
            default:
                return state;
        }
    }),
};
