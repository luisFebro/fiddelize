import { useEffect, useState } from "react";
import getItems from "init/lStorage";
import getId from "utils/getId";

const [adminGame, userGame] = getItems("currUser", ["adminGame", "userGame"]);

export default function useCheckBeatGames({ currPoints }) {
    const [data, setData] = useState({
        didBeatGame: null,
        beatGameList: [],
        beatGamesLoading: true,
    });
    const { beatGamesLoading } = data;

    useEffect(() => {
        if (!beatGamesLoading || !currPoints) return;
        const { didBeatGame, beatGameList } = checkForBeatGames({
            currPoints,
        });

        setData({
            didBeatGame,
            beatGameList,
            beatGamesLoading: false,
        });
    }, [currPoints, beatGamesLoading]);

    return data;
}

function checkForBeatGames({ currPoints }) {
    const beatGameList = [];

    const didBeatTargetPrizeGame = checkGame("targetPrize", {
        list: beatGameList,
        currPoints,
    });

    const didBeatDiscountBackGame = checkGame("discountBack", {
        list: beatGameList,
        currPoints,
    });

    const didBeatGame = didBeatTargetPrizeGame || didBeatDiscountBackGame;

    return {
        didBeatGame,
        beatGameList,
    };
}
// GAMES CHECKERS

function checkGame(gameName, { list, currPoints }) {
    const { availableGames } = adminGame;
    const { targetPoints, id } = adminGame[gameName];
    const { pendingBenefits = [] } = userGame;

    const isGameAvailable = () => availableGames.includes(gameName);
    const isPendingBenefit = () => pendingBenefits.includes(gameName);

    // here goes the cond to check if the game has already checked and set beating data
    const didBeatGame =
        currPoints >= targetPoints && isGameAvailable() && !isPendingBenefit();
    if (!didBeatGame) return false;

    const { challN } = userGame[gameName];

    list.push({
        id: getId(),
        game: gameName,
        targetPoints,
        benefitDesc: handleBenefitDesc(gameName),
        currChall: challN || 1,
        challTypeId: id,
        received: false,
    });

    return true;
}

// HELPERS
function handleBenefitDesc(game) {
    if (game === "targetPrize") return adminGame[game].prizeDesc;
    if (game === "discountBack") {
        const discountMoney = adminGame[game].targetMoney;
        return `R$ ${discountMoney} de desconto.`;
    }

    return null;
}
// END HELPERS
