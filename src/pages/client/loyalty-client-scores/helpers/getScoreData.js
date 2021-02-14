import getIntOrFloat from "../../../../utils/numbers/getIntOrFloat";
import { convertCommaToDot } from "../../../../utils/numbers/convertDotComma";

export default function getScoreData({ currentScore, paidValue }) {
    if (!paidValue) return {};

    let currScoreBefore = currentScore || 0;
    currScoreBefore = getIntOrFloat(currScoreBefore);

    let cashCurrScore = convertCommaToDot(paidValue);
    cashCurrScore = getIntOrFloat(cashCurrScore);

    let currScoreNow = parseFloat(currScoreBefore) + parseFloat(cashCurrScore);
    currScoreNow = getIntOrFloat(currScoreNow);

    return {
        currScoreBefore,
        cashCurrScore,
        currScoreNow,
    };
}
