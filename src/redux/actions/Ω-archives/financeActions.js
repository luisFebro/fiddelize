import axios from "axios";
import { getHeaderJson } from "../../utils/server/getHeaders";
import addSpacingPlusToQuery from "../../utils/string/addSpacingPlusToQuery";
import { setCustomLoading } from "./globalActions";

// CRUD
export const createFinance = async (dispatch, objToSend) => {
    try {
        return await axios.post("/api/finance", objToSend, getHeaderJson);
    } catch (err) {
        return err.response;
    }
};

// read
export const getPeriodQuery = (period, chosenDate) => {
    switch (period) {
        case "day":
            return `&thisDayMonth=${addSpacingPlusToQuery(chosenDate)}`;
        case "month":
            return `&thisMonthYear=${addSpacingPlusToQuery(chosenDate)}`;
        case "all":
            return "";
        default:
            console.log("Something did not work in the query switch");
    }
};

export const getCashOpsList = async (
    dispatch,
    period,
    skip,
    chosenDate,
    search,
    autocomplete
) => {
    console.log("Why period is displaying ALL in the first rendering?", period);
    const periodQuery = getPeriodQuery(period, chosenDate);
    const searchQuery = search ? `&search=${search}` : "";
    const autocompleteQuery = autocomplete ? "&autocomplete=true" : "";

    setCustomLoading(dispatch, true);

    try {
        const url = `/api/finance/cash-ops/list/${period}?skip=${skip}${periodQuery}${searchQuery}${autocompleteQuery}`;
        const res = await axios.get(url, getHeaderJson);
        setCustomLoading(dispatch, false);
        return res;
    } catch (err) {
        setCustomLoading(dispatch, false);
        return err.response;
    }
};
// end read

export const updateFinance = async (dispatch, itemId, bodyToSend) => {
    try {
        return await axios.put(
            `/api/finance/${itemId}`,
            bodyToSend,
            getHeaderJson
        );
    } catch (err) {
        return err.response;
    }
};

export const removeFinance = async (dispatch, itemId) => {
    try {
        return await axios.delete(`/api/finance/${itemId}`, getHeaderJson);
    } catch (err) {
        return err.response;
    }
};
// END CRUD

// LIST
export const getAllAvailableNames = async (dispatch, isAdmin = false) => {
    try {
        return await axios.get(
            `/api/finance/staff/list/names${isAdmin ? "?role=admin" : ""}`,
            getHeaderJson
        );
    } catch (err) {
        return err.response;
    }
};
