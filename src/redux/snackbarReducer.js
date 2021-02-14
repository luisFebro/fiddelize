import { reducer } from "easy-peasy";
// actions are used with the usestoredispatch hook inside the wanting functional component
// You can use only one isntance of object like 'cases' for each object.
// Reducer Naming Structure: type: MAIN/SUBJECT + PARTICIPLE VERB eg. USER_CLEARED

// REDUCERS
const initialState = {
    isSnackbarOpen: false,
    snackbarMsg: "",
    snackbarStatusColor: "",
    snackbarTiming: 0,
};

export const snackbarReducer = {
    cases: reducer((state = initialState, action) => {
        switch (action.type) {
            // Show
            case "SHOW_SNACKBAR":
                return {
                    ...state,
                    isSnackbarOpen: true,
                    snackbarMsg: action.payload.msg,
                    snackbarTiming: action.payload.timeRunning,
                    snackbarStatusColor: action.payload.statusColor,
                };
            // Close
            case "CLOSE_SNACKBAR":
                return {
                    ...state,
                    isSnackbarOpen: false,
                    snackbarMsg: "",
                };
            default:
                return state;
        }
    }),
};
