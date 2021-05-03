import getIntOrFloat from "../../../../utils/numbers/getIntOrFloat";
import { convertCommaToDot } from "../../../../utils/numbers/convertDotComma";

export default function getScoreData({ currentScore, paidValue }) {
    if (!paidValue) return {};

    let currPointsBefore = currentScore || 0;
    currPointsBefore = getIntOrFloat(currPointsBefore);

    let lastPoints = convertCommaToDot(paidValue);
    lastPoints = getIntOrFloat(lastPoints);

    let currPointsNow = parseFloat(currPointsBefore) + parseFloat(lastPoints);
    currPointsNow = getIntOrFloat(currPointsNow);

    return {
        currPointsBefore,
        lastPoints,
        currPointsNow,
    };
}
