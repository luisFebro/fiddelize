// naming structure: action > type > speficification e.g action: GET_MODAL_BLUE / func: getModalBlue

// SHOW MODALS
export const showModalUnderConstruction = dispatch => {
    return dispatch({ type: 'SHOW_MODAL_UNDER_CONSTRUCTION', payload: true });
};

export const showModalSelect = dispatch => {
    return dispatch({ type: 'MODAL_SELECT_DISPLAYED' });
};

// default
export const showModalDefault = dispatch => {
    return dispatch({ type: 'SHOW_MODAL_DEFAULT', payload: true });
};
// CONFIRMATION MODALS
// product dashboards - change a field
export const showModalConfTitle = dispatch => {
    return dispatch({ type: 'SHOW_MODAL_CONF_TITLE', payload: true });
};
export const showModalConfYesNo = dispatch => {
    return dispatch({ type: 'SHOW_MODAL_CONF_YES_NO', payload: true });
};
export const showModalTextField = dispatch => {
    return dispatch({ type: 'SHOW_MODAL_TEXT_FIELD', payload: true });
};
// END CONFIRMATION MODALS
// Auth Modals
export const showModalLogin = dispatch => {
    return dispatch({ type: 'SHOW_MODAL_LOGIN', payload: true });
};

export const showModalRegister = dispatch => {
    return dispatch({ type: 'SHOW_MODAL_REGISTER', payload: true });
};
// END SHOW MODALS

// CLOSE MODALS
export const closeModal = dispatch => {
    return dispatch({ type: 'CLOSE_ALL_MODALS' });
};
// END CLOSE MODALS
