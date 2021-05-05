// naming structure: action > type > speficification e.g action: GET_MODAL_BLUE / func: getModalBlue
import axios from "axios";
import { getHeaderJson } from "utils/server/getHeaders";
import { ROOT } from "api/root"; // ${ROOT}
import { setLoadingProgress } from "./globalActions";

export const sendWelcomeConfirmEmail = async (bodyEmail, userId) => {
    try {
        return await axios.post(
            `${ROOT}/email/client/welcome-and-confirm/${userId}`,
            bodyEmail,
            getHeaderJson
        );
    } catch (err) {
        return err.response;
    }
};

export const sendBuyRequestEmail = async (dispatch, bodyEmail) => {
    setLoadingProgress(dispatch, true);
    try {
        const res = await axios.post(
            `${ROOT}/email/admin/order-request`,
            bodyEmail,
            getHeaderJson
        );
        setLoadingProgress(dispatch, false);
        return res;
    } catch (err) {
        setLoadingProgress(dispatch, false);
        return err.response;
    }
};

export const sendNewPasswordLink = async (dispatch, bodyEmail) => {
    setLoadingProgress(dispatch, true);
    try {
        const res = await axios.post(
            `${ROOT}/email/client/new-password`,
            bodyEmail,
            getHeaderJson
        );
        setLoadingProgress(dispatch, false);
        return res;
    } catch (err) {
        setLoadingProgress(dispatch, false);
        return err.response;
    }
};

// n1 -here err.response makes sure if response is defined before setting Error. This avoids a popup error
// n2 - This next will redirect the page to home after user send message succefully
