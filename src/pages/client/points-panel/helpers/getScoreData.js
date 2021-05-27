import getIntOrFloat from "utils/numbers/getIntOrFloat";

export default function getScoreData({ currPoints, paidValue }) {
    if (!paidValue) return {};

    let currPointsBefore = currPoints || 0;
    currPointsBefore = getIntOrFloat(currPointsBefore);

    let currPointsNow = parseFloat(currPointsBefore) + parseFloat(paidValue);
    currPointsNow = getIntOrFloat(currPointsNow);

    return {
        currPointsBefore,
        currPointsNow,
    };
}
