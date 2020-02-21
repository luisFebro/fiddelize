// naming structure:
// action > type > specification e.g showMenuDark / SHOW_MENU_DARK
// statusColor can be warning, success, error
export const showSnackbar = (dispatch, msg, statusColor = 'warning', timeRunning = 4000) => {
    const data = {
        msg,
        statusColor,
        timeRunning
    };
    dispatch({ type: 'SHOW_SNACKBAR', payload: data });
};

export const closeSnackbar = dispatch => {
    dispatch({ type: 'CLOSE_SNACKBAR' });
};
