// naming structure: action > type > speficification e.g action: GET_MODAL_BLUE / func: getModalBlue

// Find an object according to an id
export const findAnItem = (dispatch, allItemsList, _id, attachedObj) => {
    const item = allItemsList.find((item) => item._id === _id);
    // Putting together the current object with additional obj to change dynamically data from component
    const finalItem = { ...item, ...attachedObj };
    console.log("item from globalActions.js", finalItem);
    dispatch({ type: "CURRENT_ITEM_FOUND", payload: finalItem });
    return finalItem;
};

export const setRun = (dispatch, payload, options = {}) => {
    const { array, runName2 } = options;
    const data = { payload, array, runName2 };
    return dispatch({ type: "RUN_SET", data });
};

// const defaultVariableOptions = { key: "value" }
// export const setVariable = (dispatch, keyValueObj = defaultVariableOptions) => {
//     return dispatch({ type: 'VARIABLE', payload: keyValueObj });
// };

// SET LOADING
// On: loading indicator displaying for miliseconds as long as the data is being fetched
// Off: no loading indicator displaying
export const setLoadingOn = (dispatch) => dispatch({ type: "SHOW_LOADING" });
export const setLoadingOff = (dispatch) => dispatch({ type: "CLEAR_LOADING" });
// END SET LOADING

export const setLoadingProgress = (dispatch, status) =>
    dispatch({ type: "LOADING_PROGRESS_TOGGLED", payload: status });

export const setCustomLoading = (dispatch, status) =>
    dispatch({ type: "CUSTOM_LOADING_TOGGLED", payload: status });

export const setCustomLoading2 = (dispatch, status) =>
    dispatch({ type: "CUSTOM_LOADING_2_TOGGLED", payload: status });

// Important: do not forget to clear error methods off
// ERROR
export const setErrorOn = (dispatch, errorMsg) =>
    dispatch({ type: "SHOW_ERROR", payload: errorMsg });
export const setErrorOff = (dispatch) => dispatch({ type: "CLEAR_ERROR" });
// END ERROR

// from former errorReducer
// export const checkForServerError = serverStatus => {
//     // Check if html code error is 500 - Internal Server Error
//     if (serverStatus === 500) {
//         return true;
//     }
//     return false;
// };
