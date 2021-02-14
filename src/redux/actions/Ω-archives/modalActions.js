// naming structure: action > type > speficification e.g action: GET_MODAL_BLUE / func: getModalBlue

// SHOW MODALS
export const showModalUnderConstruction = (dispatch) =>
    dispatch({ type: "SHOW_MODAL_UNDER_CONSTRUCTION", payload: true });

export const showModalSelect = (dispatch) =>
    dispatch({ type: "MODAL_SELECT_DISPLAYED" });

// default
export const showModalDefault = (dispatch) =>
    dispatch({ type: "SHOW_MODAL_DEFAULT", payload: true });
// CONFIRMATION MODALS
// product dashboards - change a field
export const showModalConfTitle = (dispatch) =>
    dispatch({ type: "SHOW_MODAL_CONF_TITLE", payload: true });
export const showModalConfYesNo = (dispatch) =>
    dispatch({ type: "SHOW_MODAL_CONF_YES_NO", payload: true });
export const showModalTextField = (dispatch) =>
    dispatch({ type: "SHOW_MODAL_TEXT_FIELD", payload: true });
// END CONFIRMATION MODALS
// Auth Modals
export const showModalLogin = (dispatch) =>
    dispatch({ type: "SHOW_MODAL_LOGIN", payload: true });

export const showModalRegister = (dispatch) =>
    dispatch({ type: "SHOW_MODAL_REGISTER", payload: true });
// END SHOW MODALS

// CLOSE MODALS
export const closeModal = (dispatch) => dispatch({ type: "CLOSE_ALL_MODALS" });
// END CLOSE MODALS
